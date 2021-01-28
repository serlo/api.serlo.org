/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { ForbiddenError, UserInputError } from 'apollo-server'

import { AbstractUuidResolvers, DiscriminatorType, UuidPayload } from './types'
import { resolveCustomId } from '~/config/alias'
import { Context } from '~/internals/graphql'
import {
  assertUserIsAuthenticated,
  createMutationNamespace,
} from '~/schema/utils'
import { decodePath, encodePath } from '~/schema/uuid/alias'
import { QueryUuidArgs } from '~/types'

export const resolvers: AbstractUuidResolvers = {
  AbstractUuid: {
    __resolveType(uuid) {
      return uuid.__typename
    },
  },
  Query: {
    async uuid(_parent, payload, { dataSources }) {
      const id = await resolveIdFromPayload(dataSources, payload)
      const uuid =
        id === null ? null : await dataSources.model.serlo.getUuid({ id })
      return checkUuid(payload, uuid as UuidPayload | null)
    },
  },
  Mutation: {
    uuid: createMutationNamespace(),
  },
  UuidMutation: {
    async setState(_parent, payload, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)
      // TODO: Mock permissions for now
      if ([1, 10, 15473, 18981].indexOf(userId) < 0) {
        throw new ForbiddenError('You are not allowed to set the thread state.')
      }

      const { id, trashed } = payload.input
      const ids = Array.isArray(id) ? id : [id]
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
    /^\/(\d+)$/,
    /^\/entity\/view\/(\d+)$/,
    /^\/entity\/repository\/compare\/\d+\/(\d+)$/,
    /^\/user\/profile\/(\d+)$/,
  ]) {
    const match = regex.exec(cleanPath)

    if (match) return parseInt(match[1])
  }

  const customId = resolveCustomId({
    path: cleanPath,
    instance: alias.instance,
  })
  if (customId) return customId

  return (await dataSources.model.serlo.getAlias(alias))?.id ?? null
}

function checkUuid(payload: QueryUuidArgs, uuid: UuidPayload | null) {
  if (uuid !== null) {
    if (payload.alias != null) {
      if (
        payload.alias.path.startsWith('/user/profile/') &&
        uuid.__typename !== DiscriminatorType.User
      ) {
        return null
      }
    }

    if (uuid.__typename === DiscriminatorType.Comment) return null
  }

  return uuid
}
