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
import { AuthenticationError, ForbiddenError } from 'apollo-server'

import { resolveConnection } from '../connection'
import { requestsOnlyFields } from '../utils'
import { AbstractUuidPayload, resolveAbstractUuid } from '../uuid'
import { resolveUser, UserPayload } from '../uuid/user'
import { Notification, NotificationResolvers } from './types'

export const resolvers: NotificationResolvers = {
  Notification: {
    async event(parent, _args, { dataSources }, info) {
      const partialEvent = { id: parent.eventId }
      if (requestsOnlyFields('NotificationEvent', ['id'], info)) {
        return partialEvent
      }
      return await dataSources.serlo.getNotificationEvent(partialEvent)
    },
  },
  NotificationEvent: {
    async actor(parent, _args, { dataSources }, info) {
      const partialActor = { id: parent.actorId }
      if (requestsOnlyFields('User', ['id'], info)) {
        return partialActor
      }
      const data = await dataSources.serlo.getUuid<UserPayload>(partialActor)
      return resolveUser(data)
    },
    async object(parent, _args, { dataSources }) {
      const data = await dataSources.serlo.getUuid<AbstractUuidPayload>({
        id: parent.objectId,
      })
      return resolveAbstractUuid(data)
    },
  },
  Query: {
    async notifications(
      _parent,
      { unread, ...cursorPayload },
      { dataSources, user }
    ) {
      if (user === null) throw new AuthenticationError('You are not logged in')
      const { notifications } = await dataSources.serlo.getNotifications({
        id: user,
      })
      return resolveConnection<Notification>({
        nodes:
          unread == null
            ? notifications
            : notifications.filter((notification) => {
                return notification.unread === unread
              }),
        payload: cursorPayload,
        createCursor(node) {
          return `${node.id}`
        },
      })
    },
  },
  Mutation: {
    async setNotificationState(_parent, payload, { dataSources, user }) {
      if (user === null) throw new AuthenticationError('You are not logged in')
      await dataSources.serlo.setNotificationState({
        id: payload.id,
        userId: user,
        unread: payload.unread,
      })
    },
    async _setNotifications(_parent, payload, { dataSources, service }) {
      if (service !== 'serlo.org') {
        throw new ForbiddenError(
          'You do not have the permissions to set notifications'
        )
      }
      await dataSources.serlo.setNotifications(payload)
    },
    async _setNotificationEvent(
      _parent,
      notificationEvent,
      { dataSources, service }
    ) {
      if (service !== 'serlo.org') {
        throw new ForbiddenError(
          'You do not have the permissions to set notifications'
        )
      }
      await dataSources.serlo.setNotificationEvent(notificationEvent)
    },
  },
}
