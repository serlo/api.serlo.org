import * as auth from '@serlo/authorization'
import * as t from 'io-ts'
import { RowDataPacket } from 'mysql2'

import { resolveCustomId } from '~/config'
import { UserInputError } from '~/errors'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  InterfaceResolvers,
  Mutations,
  LegacyQueries,
  Context,
  Model,
} from '~/internals/graphql'
import {
  Uuid,
  DiscriminatorType,
  EntityTypeDecoder,
  EntityRevisionTypeDecoder,
  castToAlias,
  CommentStatusDecoder,
} from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import { decodePath, encodePath } from '~/schema/uuid/alias/utils'
import { QueryUuidArgs } from '~/types'
import { isDefined } from '~/utils'

export const resolvers: InterfaceResolvers<'AbstractUuid'> &
  Mutations<'uuid'> &
  LegacyQueries<'uuid'> = {
  AbstractUuid: {
    __resolveType(uuid) {
      return uuid.__typename
    },
  },
  Query: {
    async uuid(_parent, payload, { dataSources, database }) {
      const id = await resolveIdFromPayload(dataSources, payload)

      if (id === null || !Uuid.is(id)) return null

      const uuid = await resolveUuid({ id, database })

      if (uuid != null) return uuid

      const uuidFromDatabaseLayer = await dataSources.model.serlo.getUuid({
        id,
      })

      return checkUuid(payload, uuidFromDatabaseLayer)
    },
  },
  Mutation: {
    uuid: createNamespace(),
  },
  UuidMutation: {
    async setState(_parent, payload, { dataSources, userId }) {
      const { id, trashed } = payload.input
      const ids = id

      const guards = await Promise.all(
        ids.map(async (id): Promise<auth.AuthorizationGuard | null> => {
          // TODO: this is not optimized since it fetches the object twice and sequentially.
          // change up fetchScopeOfUuid to return { scope, object } instead
          const scope = await fetchScopeOfUuid({ id, dataSources })
          const object = await dataSources.model.serlo.getUuid({ id })
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
        userId,
        guards: guards.filter(isDefined),
        message:
          'You are not allowed to set the state of the provided UUID(s).',
        dataSources,
      })

      await dataSources.model.serlo.setUuidState({ ids, userId, trashed })

      return { success: true, query: {} }
    },
  },
}

const BaseComment = t.type({
  id: Uuid,
  discriminator: t.literal(DiscriminatorType.Comment),
  trashed: t.boolean,
  authorId: t.number,
  title: t.string,
  date: t.string,
  archived: t.boolean,
  content: t.string,
  parentUuid: t.union([Uuid, t.null]),
  parentComment: t.union([Uuid, t.null]),
  status: CommentStatusDecoder,
  childrenIds: t.array(Uuid),
})

async function resolveUuid({
  id,
  database,
}: {
  id: number
  database: Context['database']
}): Promise<Model<'AbstractUuid'> | null> {
  const [result] = await database.execute<RowDataPacket[]>(
    ` select
        uuid.id as id,
        uuid.trashed,
        uuid.discriminator,
        comment.author_id as authorId,
        comment.title as title,
        comment.date as date,
        comment.archived as archived,
        comment.content as content,
        comment.parent_id as parentComment,
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

  const baseUuid = result.at(0)

  if (BaseComment.is(baseUuid)) {
    const parentId = baseUuid.parentUuid ?? baseUuid.parentComment ?? null

    if (parentId == null) return null

    return {
      ...baseUuid,
      __typename: DiscriminatorType.Comment,
      parentId,
      alias: castToAlias(`/${parentId}#comment-${baseUuid.id}`),
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

function checkUuid(payload: QueryUuidArgs, uuid: Model<'AbstractUuid'> | null) {
  if (uuid !== null) {
    if (payload.alias != null) {
      if (
        payload.alias.path.startsWith('/user/profile/') &&
        uuid.__typename !== DiscriminatorType.User
      ) {
        return null
      }
    }
  }

  return uuid
}
