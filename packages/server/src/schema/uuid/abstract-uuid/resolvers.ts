/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as auth from '@serlo/authorization'
import { UserInputError } from 'apollo-server'
import { either as E } from 'fp-ts'

import { resolveCustomId } from '~/config/alias'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  InterfaceResolvers,
  Mutations,
  Queries,
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
  Queries<'uuid'> = {
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

      if (uuid) {
        // @ts-expect-error
        uuid['_cacheKeyStack'] = uuid['_cacheKeyStack'] ?? []
        // @ts-expect-error
        uuid['_cacheKeyStack'].push(
          dataSources.model.serlo.getUuid._querySpec.getKey({
            id: decodedUuid.right,
          })
        )
      }

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
              case DiscriminatorType.Page:
                return 'Page'
              case DiscriminatorType.PageRevision:
                return 'PageRevision'
              case DiscriminatorType.TaxonomyTerm:
                return 'TaxonomyTerm'
              case DiscriminatorType.User:
                return 'User'
              default:
                if (E.isRight(EntityTypeDecoder.decode(object.__typename))) {
                  return 'Entity'
                }
                if (
                  E.isRight(EntityRevisionTypeDecoder.decode(object.__typename))
                ) {
                  return 'EntityRevision'
                }
                return 'unknown'
            }
          }
        })
      )

      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        userId,
        guards: guards.filter(isDefined),
        message:
          'You are not allowed to set the state of the provided UUID(s).',
        dataSources,
      })

      await dataSources.model.serlo.setUuidState({
        ids,
        userId,
        trashed,
      })
      return {
        success: true,
        query: {},
      }
    },
  },
}

async function resolveIdFromPayload(
  dataSources: Context['dataSources'],
  payload: QueryUuidArgs
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
  alias: NonNullable<QueryUuidArgs['alias']>
): Promise<number | null> {
  const cleanPath = encodePath(decodePath(alias.path))

  if (!cleanPath.startsWith('/')) {
    throw new UserInputError(
      "First is the worst, please add a '/' at the beginning of your path"
    )
  }

  for (const regex of [
    /^\/(?<id>\d+)$/,
    /^\/entity\/view\/(?<id>\d+)$/,
    /^\/(?<subject>[^/]+\/)?(?<id>\d+)\/(?<title>[^/]*)$/,
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
