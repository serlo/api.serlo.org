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
import { resolveConnection } from '../connection'
import { assertUserIsAuthenticated, createMutationNamespace } from '../utils'
import {
  NotificationEventPayload,
  NotificationPayload,
  NotificationResolvers,
} from './types'

export const resolvers: NotificationResolvers = {
  AbstractNotificationEvent: {
    __resolveType(notificationEvent) {
      return notificationEvent.__typename
    },
  },
  Notification: {
    async event(parent, _args, { dataSources }) {
      return (await dataSources.model.serlo.getNotificationEvent({
        id: parent.eventId,
      })) as NotificationEventPayload
    },
  },
  Query: {
    async notifications(
      _parent,
      { unread, ...cursorPayload },
      { dataSources, userId }
    ) {
      assertUserIsAuthenticated(userId)
      const { notifications } = await dataSources.model.serlo.getNotifications({
        id: userId,
      })
      return resolveConnection<NotificationPayload>({
        nodes: notifications.filter((notification) => {
          return (
            notification !== null &&
            (unread == null || notification.unread === unread)
          )
        }),
        payload: cursorPayload,
        createCursor(node) {
          return `${node.id}`
        },
      })
    },
    async notificationEvent(_parent, payload, { dataSources }) {
      return (await dataSources.model.serlo.getNotificationEvent(
        payload
      )) as NotificationEventPayload
    },
  },
  Mutation: {
    notification: createMutationNamespace(),
  },
  NotificationMutation: {
    async setState(_parent, payload, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)
      const { id, unread } = payload.input
      const ids = Array.isArray(id) ? id : [id]
      const res = await dataSources.model.serlo.setNotificationState({
        ids,
        userId,
        unread,
      })
      return { success: res.every(Boolean), query: {} }
    },
  },
}
