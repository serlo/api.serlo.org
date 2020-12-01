/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { UserInputError } from 'apollo-server'

import { QueryUuidArgs } from '../../../../types'
import { Context } from '../../types'
import { decodePath } from '../alias'
import { AbstractUuidResolvers, DiscriminatorType, UuidPayload } from './types'

export const resolvers: AbstractUuidResolvers = {
  AbstractUuid: {
    __resolveType(uuid) {
      return uuid.__typename
    },
  },
  Query: {
    async uuid(_parent, payload, { dataSources }) {
      const args = await resolveArgsFromPayload(dataSources, payload)

      if (args === null) return null

      const uuid = await dataSources.serlo.getUuid<UuidPayload>(args)

      if (uuid && uuid.__typename === DiscriminatorType.Comment) return null
      if (uuid && args.typename && uuid.__typename !== args.typename)
        return null

      return uuid
    },
  },
}

async function resolveArgsFromPayload(
  dataSources: Context['dataSources'],
  payload: QueryUuidArgs
) {
  if (payload.alias) {
    return await resolveArgsFromAlias(dataSources, payload.alias)
  } else if (payload.id) {
    return { id: payload.id }
  } else {
    throw new UserInputError('you need to provide an id or an alias')
  }
}

async function resolveArgsFromAlias(
  dataSources: Context['dataSources'],
  alias: NonNullable<QueryUuidArgs['alias']>
): Promise<{ id: number; typename?: DiscriminatorType } | null> {
  const cleanPath = decodePath(alias.path)

  if (!cleanPath.startsWith('/')) {
    throw new UserInputError(
      "First is the worst, please add a '/' at the beginning of your path"
    )
  }

  const match = /^\/(\d+)$/.exec(cleanPath)
  if (match) return { id: parseInt(match[1]) }

  const matchUser = /^\/user\/profile\/(\d+)$/.exec(cleanPath)
  if (matchUser)
    return {
      id: parseInt(matchUser[1]),
      typename: DiscriminatorType.User,
    }

  return await dataSources.serlo.getAlias(alias)
}
