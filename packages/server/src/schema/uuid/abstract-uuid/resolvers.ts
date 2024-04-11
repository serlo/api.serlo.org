import * as auth from '@serlo/authorization'
import { either as E } from 'fp-ts'

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
    async uuid(_parent, payload, { dataSources }) {
      const id = await resolveIdFromPayload(dataSources, payload)

      if (id === null) return null

      const decodedUuid = Uuid.decode(id)
      if (E.isLeft(decodedUuid)) return null

      const uuid = await dataSources.model.serlo.getUuid({
        id: decodedUuid.right,
      })
      return checkUuid(payload, uuid)
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
              // case DiscriminatorType.Page:
              //   return 'Page'
              // case DiscriminatorType.PageRevision:
              //   return 'PageRevision'
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
