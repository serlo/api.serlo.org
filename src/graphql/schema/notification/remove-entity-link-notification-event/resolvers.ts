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
import { requestsOnlyFields } from '../../utils'
import { EntityPayload } from '../../uuid/abstract-entity'
import { UserPayload } from '../../uuid/user'
import { RemoveEntityLinkNotificationEventResolvers } from './types'

export const resolvers: RemoveEntityLinkNotificationEventResolvers = {
  RemoveEntityLinkNotificationEvent: {
    async actor(notificationEvent, _args, { dataSources }, info) {
      const partialUser = { id: notificationEvent.actorId }
      if (requestsOnlyFields('User', ['id'], info)) {
        return partialUser
      }
      return dataSources.serlo.getUuid<UserPayload>(partialUser)
    },
    async parent(notificationEvent, _args, { dataSources }) {
      return dataSources.serlo.getUuid<EntityPayload>({
        id: notificationEvent.parentId,
      })
    },
    async child(notificationEvent, _args, { dataSources }) {
      return dataSources.serlo.getUuid<EntityPayload>({
        id: notificationEvent.childId,
      })
    },
  },
}
