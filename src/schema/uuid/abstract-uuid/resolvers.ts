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
      if (payload.alias) {
        const cleanPath = decodePath(payload.alias.path)
        if (!cleanPath.startsWith('/')) {
          throw new UserInputError(
            "First is the worst, please add a '/' at the beginning of your path"
          )
        }
        const match = /^\/(\d+)$/.exec(cleanPath)
        if (match) {
          const id = parseInt(match[1], 10)
          return (await dataSources.model.serlo.getUuid({
            id,
          })) as UuidPayload | null
        }

        if (cleanPath.startsWith('/user/profile/')) {
          const match = /^\/user\/profile\/(\d+)$/.exec(cleanPath)
          if (match) {
            const id = parseInt(match[1], 10)
            const uuid = (await dataSources.model.serlo.getUuid({
              id,
            })) as UuidPayload | null
            return uuid && uuid.__typename === 'User' ? uuid : null
          }
        }

        //TODO: to support legacy feature. remove after frontend is 100% (#143)
        if (cleanPath.startsWith('/entity/view/')) {
          const match = /^\/entity\/view\/(\d+)$/.exec(cleanPath)
          if (match) {
            const id = parseInt(match[1], 10)
            const uuid = await dataSources.serlo.getUuid<UuidPayload>({ id })
            return uuid || null
          }
        }

        const alias = await dataSources.model.serlo.getAlias(payload.alias)
        return alias
          ? ((await dataSources.model.serlo.getUuid({
              id: alias.id,
            })) as UuidPayload | null)
          : null
      } else if (payload.id) {
        const uuid = (await dataSources.model.serlo.getUuid({
          id: payload.id,
        })) as UuidPayload | null
        if (uuid && uuid.__typename === DiscriminatorType.Comment) {
          return null
        } else return uuid
      } else {
        throw new UserInputError('you need to provide an id or an alias')
      }
    },
  },
}
