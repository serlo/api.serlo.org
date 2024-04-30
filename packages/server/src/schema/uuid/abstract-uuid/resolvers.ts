import * as auth from '@serlo/authorization'
import { option as O } from 'fp-ts'
import * as t from 'io-ts'
import { date } from 'io-ts-types/lib/date'

import { createCachedResolver } from '~/cached-resolver'
import { resolveCustomId } from '~/config'
import { Context } from '~/context'
import { UserInputError } from '~/errors'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  Model,
} from '~/internals/graphql'
import { DatabaseLayer } from '~/model'
import {
  UuidDecoder,
  DiscriminatorType,
  EntityTypeDecoder,
  EntityRevisionTypeDecoder,
  CommentStatusDecoder,
} from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import { decodePath, encodePath } from '~/schema/uuid/alias/utils'
import { Resolvers, QueryUuidArgs } from '~/types'
import { isDefined } from '~/utils'

export const UuidResolver = createCachedResolver<
  { id: number },
  Model<'AbstractUuid'> | null
>({
  name: 'UuidResolver',
  decoder: t.union([t.null, UuidDecoder]),
  enableSwr: true,
  staleAfter: { days: 1 },
  maxAge: { days: 7 },
  getKey: ({ id }) => {
    return `de.serlo.org/api/uuid/${id}`
  },
  getPayload: (key) => {
    if (!key.startsWith('de.serlo.org/api/uuid/')) return O.none
    const id = parseInt(key.replace('de.serlo.org/api/uuid/', ''), 10)
    return O.some({ id })
  },
  getCurrentValue: resolveUuidFromDatabase,
  examplePayload: { id: 1 },
})

export const resolvers: Resolvers = {
  AbstractUuid: {
    __resolveType(uuid) {
      return uuid.__typename
    },
  },
  Query: {
    async uuid(_parent, payload, context) {
      const { dataSources } = context
      const id = await resolveIdFromPayload(dataSources, payload)

      if (id === null) return null

      const uuid = await UuidResolver.resolve({ id }, context)

      if (uuid != null) return uuid

      const uuidFromDBLayer = await DatabaseLayer.makeRequest('UuidQuery', {
        id,
      })

      return UuidDecoder.is(uuidFromDBLayer) ? uuidFromDBLayer : null
    },
  },
  Mutation: {
    uuid: createNamespace(),
  },
  UuidMutation: {
    async setState(_parent, payload, context) {
      const { dataSources, userId } = context
      const { id, trashed } = payload.input
      const ids = id

      const guards = await Promise.all(
        ids.map(async (id): Promise<auth.AuthorizationGuard | null> => {
          // TODO: this is not optimized since it fetches the object twice and sequentially.
          // change up fetchScopeOfUuid to return { scope, object } instead
          const scope = await fetchScopeOfUuid({ id }, context)
          const object = await UuidResolver.resolve({ id }, context)
          if (object === null) {
            return null
          } else {
            return auth.Uuid.setState(getType(object))(scope)
          }

          function getType(object: Model<'AbstractUuid'>): auth.UuidType {
            switch (object.__typename) {
              case DiscriminatorType.Page:
                return 'Page'
              case DiscriminatorType.PageRevision:
                return 'PageRevision'
              case DiscriminatorType.TaxonomyTerm:
                return 'TaxonomyTerm'
              case DiscriminatorType.User:
                return 'User'
              default:
                if (EntityTypeDecoder.is(object.__typename)) {
                  return 'Entity'
                }
                if (EntityRevisionTypeDecoder.is(object.__typename)) {
                  return 'EntityRevision'
                }
                return 'unknown'
            }
          }
        }),
      )

      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        guards: guards.filter(isDefined),
        message:
          'You are not allowed to set the state of the provided UUID(s).',
        context,
      })

      await dataSources.model.serlo.setUuidState({ ids, userId, trashed })

      return { success: true, query: {} }
    },
  },
}

// TODO: Move to util file databse.ts
const Tinyint = t.union([t.literal(0), t.literal(1)])

const BaseComment = t.type({
  id: t.number,
  discriminator: t.literal('comment'),
  trashed: Tinyint,
  authorId: t.number,
  title: t.string,
  date: date,
  archived: Tinyint,
  content: t.string,
  parentUuid: t.union([t.number, t.null]),
  parentCommentId: t.union([t.number, t.null]),
  status: t.union([CommentStatusDecoder, t.null]),
  childrenIds: t.array(t.union([t.number, t.null])),
})

async function resolveUuidFromDatabase(
  { id }: { id: number },
  context: Pick<Context, 'database'>,
): Promise<Model<'AbstractUuid'> | null> {
  const baseUuid = await context.database.fetchOne(
    ` select
        uuid.id as id,
        uuid.trashed,
        uuid.discriminator,
        comment.author_id as authorId,
        comment.title as title,
        comment.date as date,
        comment.archived as archived,
        comment.content as content,
        comment.parent_id as parentCommentId,
        comment.uuid_id as parentUuid,
        JSON_ARRAYAGG(comment_children.id) as childrenIds,
        comment_status.name as status
      from uuid
      left join comment on comment.id = uuid.id
      left join comment comment_children on comment_children.parent_id = comment.id
      left join comment_status on comment_status.id = comment.id
      where uuid.id = ?
      group by uuid.id
    `,
    [id],
  )

  if (BaseComment.is(baseUuid)) {
    const parentId = baseUuid.parentUuid ?? baseUuid.parentCommentId ?? null

    if (parentId == null) return null

    return {
      ...baseUuid,
      __typename: DiscriminatorType.Comment,
      trashed: Boolean(baseUuid.trashed),
      archived: Boolean(baseUuid.archived),
      parentId,
      alias: `/${parentId}#comment-${baseUuid.id}`,
      status: baseUuid.status ?? 'noStatus',
      childrenIds: baseUuid.childrenIds.filter(isDefined),
      date: baseUuid.date.toISOString(),
    }
  }

  return null
}

async function resolveIdFromPayload(
  dataSources: Context['dataSources'],
  payload: QueryUuidArgs,
) {
  if (payload.alias) {
    return await resolveIdFromAlias(dataSources, payload.alias)
  } else if (payload.id) {
    return payload.id
  } else {
    throw new UserInputError('you need to provide an id or an alias')
  }
}

async function resolveIdFromAlias(
  dataSources: Context['dataSources'],
  alias: NonNullable<QueryUuidArgs['alias']>,
): Promise<number | null> {
  const cleanPath = encodePath(decodePath(alias.path))

  if (!cleanPath.startsWith('/')) {
    throw new UserInputError(
      "First is the worst, please add a '/' at the beginning of your path",
    )
  }

  for (const regex of [
    /^\/(?<id>\d+)$/,
    /^\/entity\/view\/(?<id>\d+)$/,
    /^\/(?<instance>[^/]+\/)(?<subject>[^/]+\/)?(?<id>\d+)\/(?<title>[^/]*)$/,
    /^\/entity\/repository\/compare\/\d+\/(?<id>\d+)$/,
    /^\/user\/profile\/(?<id>\d+)$/,
  ]) {
    const match = regex.exec(cleanPath)

    if (match && match.groups !== undefined) return parseInt(match.groups.id)
  }

  const customId = resolveCustomId({
    path: cleanPath,
    instance: alias.instance,
  })
  if (customId) return customId

  return (await dataSources.model.serlo.getAlias(alias))?.id ?? null
}
