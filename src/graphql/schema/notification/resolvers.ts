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
import { resolveConnection } from '../connection'
import { Context } from '../types'
import { checkUserIsAuthenticated } from '../utils'
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
    event(parent, _args, context) {
      const { dataSources }: Context = context
      return dataSources.serlo.getNotificationEvent<NotificationEventPayload>({
        id: parent.eventId,
      })
    },
  },
  Query: {
    async notifications(
      _parent,
      { unread, ...cursorPayload },
      { dataSources, user }
    ) {
      checkUserIsAuthenticated(user)
      const { notifications } = await dataSources.serlo.getNotifications({
        id: user as number,
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
    async notificationEvent(_parent, payload, context) {
      const { dataSources }: Context = context
      return dataSources.serlo.getNotificationEvent<NotificationEventPayload>(
        payload
      )
    },
  },
  Mutation: {
    async setNotificationState(_parent, payload, { dataSources, user }) {
      checkUserIsAuthenticated(user)
      return await dataSources.serlo.setNotificationsState({
        ids: [payload.id],
        userId: user as number,
        unread: payload.unread,
      })
    },
    async setNotificationsState(_parent, payload, { dataSources, user }) {
      checkUserIsAuthenticated(user)
      return await dataSources.serlo.setNotificationsState({
        ids: payload.ids,
        userId: user as number,
        unread: payload.unread,
      })
    },
  },
}
