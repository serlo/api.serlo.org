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

import { decodePath, UuidPayload } from '..'
import { UuidResolvers } from './types'

export const resolvers: UuidResolvers = {
  AbstractUuid: {
    __resolveType(uuid) {
      return uuid.__typename
    },
  },
  Query: {
    async uuid(_parent, payload, { dataSources }) {
      if (payload.alias) {
        const cleanPath = decodePath(payload.alias.path)
        const match = /^\/(\d+)$/.exec(cleanPath)
        if (match) {
          const id = parseInt(match[1], 10)
          return dataSources.serlo.getUuid<UuidPayload>({ id })
        }

        if (cleanPath.startsWith('/user/profile/')) {
          const match = /^\/user\/profile\/(\d+)$/.exec(cleanPath)
          if (match) {
            const id = parseInt(match[1], 10)
            const uuid = await dataSources.serlo.getUuid<UuidPayload>({ id })
            return uuid && uuid.__typename === 'User' ? uuid : null
          }
        }
        const alias = await dataSources.serlo.getAlias(payload.alias)
        return alias
          ? dataSources.serlo.getUuid<UuidPayload>({ id: alias.id })
          : null
      } else if (payload.id) {
        return dataSources.serlo.getUuid<UuidPayload>({ id: payload.id })
      } else {
        throw new UserInputError('you need to provide an id or an alias')
      }
    },
  },
}
