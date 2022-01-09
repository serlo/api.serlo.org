/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { ForbiddenError } from 'apollo-server'

import { Service } from '~/internals/authentication'
import { createNamespace, Mutations } from '~/internals/graphql'

const allowedUserIds = [
  26217, // kulla
  15473, // inyono
  131536, // dal
  32543, // botho
  178145, // CarolinJaser
]

export const resolvers: Mutations<'_cache'> = {
  Mutation: {
    _cache: createNamespace(),
  },
  _cacheMutation: {
    async set(_parent, payload, { dataSources, service, userId }) {
      const { key, value } = payload.input
      checkPermission({
        service,
        userId,
        operation: 'set',
        allowedServices: [Service.Serlo],
      })
      await dataSources.model.setCacheValue({ key, value })
      return { success: true, query: {} }
    },
    async remove(_parent, payload, { dataSources, service, userId }) {
      const { key } = payload.input
      checkPermission({
        service,
        userId,
        operation: 'remove',
        allowedServices: [Service.Serlo],
      })
      await dataSources.model.removeCacheValue({ key })
      return { success: true, query: {} }
    },
    async update(_parent, { input }, { dataSources, service, userId }) {
      checkPermission({
        service,
        userId,
        operation: 'update',
        allowedServices: [Service.Serlo, Service.SerloCacheWorker],
      })
      await Promise.all(
        input.keys.map((key) => dataSources.model.updateCacheValue({ key }))
      )
      return { success: true }
    },
  },
}

function checkPermission({
  service,
  allowedServices,
  userId,
  operation,
}: {
  service: Service
  allowedServices: Service[]
  userId: number | null
  operation: string
}) {
  if (
    process.env.ENVIRONMENT !== 'local' &&
    !allowedServices.includes(service) &&
    (userId === null || !allowedUserIds.includes(userId))
  ) {
    throw new ForbiddenError(
      `You do not have the permissions to ${operation} the cache`
    )
  }
}
