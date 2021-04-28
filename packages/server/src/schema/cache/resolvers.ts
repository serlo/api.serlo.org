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
import { ForbiddenError } from 'apollo-server'

import { Service } from '~/internals/authentication'
import { createMutationNamespace, Mutations } from '~/internals/graphql'

export const resolvers: Mutations<'cache'> = {
  Mutation: {
    cache: createMutationNamespace(),
  },
  CacheMutation: {
    async _set(_parent, payload, { dataSources, service }) {
      const { key, value } = payload.input
      if (service !== Service.Serlo) {
        throw new ForbiddenError(
          'You do not have the permissions to set the cache'
        )
      }
      await dataSources.model.setCacheValue({
        key,
        value,
      })
      return null
    },
    async _remove(_parent, payload, { dataSources, service, userId }) {
      const { key } = payload.input
      const allowedUserIds = [
        26217, // kulla
        15473, // inyono
        131536, // dal
        32543, // botho
        178145, // CarolinJaser
      ]

      if (
        service !== Service.Serlo &&
        (userId === null || !allowedUserIds.includes(userId))
      ) {
        throw new ForbiddenError(
          'You do not have the permissions to remove the cache'
        )
      }
      await dataSources.model.removeCacheValue({ key })
      return null
    },
    async _update(_parent, payload, { dataSources, service }) {
      const { keys } = payload.input
      if (service !== Service.Serlo) {
        throw new ForbiddenError(
          'You do not have the permissions to update the cache'
        )
      }
      await Promise.all(
        keys.map(async (key) => {
          await dataSources.model.updateCacheValue({ key })
        })
      )
      return null
    },
  },
}
