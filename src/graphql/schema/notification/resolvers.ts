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
import { AuthenticationError } from 'apollo-server'

import { resolveConnection } from '../connection'
import { Context } from '../types'
import {
  NotificationEventPayload,
  NotificationEventType,
  NotificationPayload,
  NotificationResolvers,
  UnsupportedNotificationEventPayload,
} from './types'
import {
  createNotificationEventResolvers,
  isUnsupportedNotificationEvent,
} from './utils'

export const resolvers: NotificationResolvers = {
  AbstractNotificationEvent: {
    __resolveType(notificationEvent) {
      return notificationEvent.__typename
    },
  },
  UnsupportedNotificationEvent: createNotificationEventResolvers(),
  Notification: {
    event(parent, _args, context) {
      return resolveNotificationEvent({ id: parent.eventId }, context)
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
      return resolveConnection<NotificationPayload>({
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
    async notificationEvent(_parent, payload, context) {
      return await resolveNotificationEvent(payload, context)
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
  },
}

async function resolveNotificationEvent(
  payload: { id: number },
  { dataSources }: Context
): Promise<NotificationEventPayload | UnsupportedNotificationEventPayload> {
  const notificationEvent = await dataSources.serlo.getNotificationEvent<
    NotificationEventPayload
  >(payload)

  if (isUnsupportedNotificationEvent(notificationEvent)) {
    return {
      __typename: NotificationEventType.Unsupported,
      type: notificationEvent.__typename,
      id: notificationEvent.id,
      instance: notificationEvent.instance,
      date: notificationEvent.date,
      actorId: notificationEvent.actorId,
    }
  }

  return notificationEvent
}
