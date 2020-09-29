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

import { resolveConnection, encodeCursor } from '../connection'
import { Context } from '../types'
import { isNotNil } from '../utils'
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
    async events(_parent, cursorPayload, { dataSources }) {
      const {
        eventIds,
        totalCount,
        pageInfo,
      } = await dataSources.serlo.getEventIds({
        after: cursorPayload.after ?? undefined,
        before: cursorPayload.before ?? undefined,
        first: cursorPayload.first ?? undefined,
        last: cursorPayload.last ?? undefined,
        userId: cursorPayload.userId ?? undefined,
        entityId: cursorPayload.entityId ?? undefined,
      })
      const eventsFromSerlo = await Promise.all(
        eventIds.map((id) => dataSources.serlo.getNotificationEvent({ id }))
      )
      const events = eventsFromSerlo.filter(isNotNil)

      return {
        edges: events.map((event) => {
          return { node: event, cursor: encodeCursor(event.id.toString()) }
        }),
        nodes: events,
        totalCount,
        pageInfo: {
          ...pageInfo,
          startCursor: encodePageInfoCursor(pageInfo.startCursor),
          endCursor: encodePageInfoCursor(pageInfo.endCursor),
        },
      }

      function encodePageInfoCursor(value: number | null) {
        return value !== null ? encodeCursor(value.toString()) : null
      }
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
