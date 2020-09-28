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
import * as R from 'ramda'

import { resolveConnection, mapConnectionAsync } from '../connection'
import { Context } from '../types'
import {
  NotificationEventPayload,
  NotificationPayload,
  NotificationResolvers,
  AbstractNotificationEventPayload,
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
    async events(_parent, cursorPayload, { dataSources }) {
      const { currentEventId } = await dataSources.serlo.getCurrentEventId()
      const eventIdConnection = resolveConnection<number>({
        nodes: R.range(1, currentEventId + 1).reverse(),
        payload: cursorPayload,
        createCursor: (id: number) => id.toString(),
      })

      return await mapConnectionAsync(
        (eventId: number) =>
          // Todo: Filter non existing events out
          dataSources.serlo.getNotificationEvent({ id: eventId }) as Promise<
            AbstractNotificationEventPayload
          >,
        eventIdConnection
      )
    },
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
      if (user === null) throw new AuthenticationError('You are not logged in')
      await dataSources.serlo.setNotificationState({
        id: payload.id,
        userId: user,
        unread: payload.unread,
      })
      return null
    },
  },
}
