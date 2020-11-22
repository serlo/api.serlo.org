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
import { AuthenticationError, UserInputError } from 'apollo-server'
import * as R from 'ramda'

import { resolveConnection } from '../connection'
import { Context } from '../types'
import { isDefined } from '../utils'
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
    async events(_parent, payload, { dataSources }) {
      if (isDefined(payload.first) && payload.first > 100)
        throw new UserInputError('first must be smaller or equal 100')

      if (isDefined(payload.last) && payload.last > 100)
        throw new UserInputError('last must be smaller or equal 100')

      const unfilteredEvents = await dataSources.serlo.getEvents()
      const events = unfilteredEvents.filter((event) => {
        if (isDefined(payload.instance) && payload.instance !== event.instance)
          return false

        if (isDefined(payload.objectId) && payload.objectId !== event.objectId)
          return false

        if (isDefined(payload.actorId) && payload.actorId !== event.actorId)
          return false

        return true
      })

      return resolveConnection({
        nodes: events,
        payload: {
          ...payload,
          first:
            R.isNil(payload.first) && R.isNil(payload.last)
              ? 100
              : payload.first,
        },
        createCursor: (event) => event.id.toString(),
      })
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
