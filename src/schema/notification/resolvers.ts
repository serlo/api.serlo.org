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

import {
  assertUserIsAuthenticated,
  createMutationNamespace,
  InterfaceResolvers,
  Mutations,
  Queries,
  TypeResolvers,
} from '~/internals/graphql'
import { resolveConnection } from '~/schema/connection/utils'
import { Notification } from '~/types'
import { isDefined } from '~/utils'

export const resolvers: TypeResolvers<Notification> &
  InterfaceResolvers<'AbstractNotificationEvent'> &
  Queries<'events' | 'notifications' | 'notificationEvent'> &
  Mutations<'notification'> = {
  AbstractNotificationEvent: {
    __resolveType(notificationEvent) {
      return notificationEvent.__typename
    },
  },
  Notification: {
    async event(parent, _args, { dataSources }) {
      const event = await dataSources.model.serlo.getNotificationEvent({
        id: parent.eventId,
      })

      if (event === null) throw new Error('event cannot be null')

      return event
    },
  },
  Query: {
    async events(_parent, payload, { dataSources }) {
      const maxReturn = 100
      let { first, last } = payload

      if (isDefined(first)) {
        first = Math.min(maxReturn, first)
      } else if (isDefined(last)) {
        last = Math.min(maxReturn, last)
      } else {
        first = maxReturn
      }

      const unfilteredEvents = await dataSources.model.serlo.getEvents()
      const events = unfilteredEvents.filter((event) => {
        if (isDefined(payload.actorId) && payload.actorId !== event.actorId)
          return false
        if (isDefined(payload.instance) && payload.instance !== event.instance)
          return false
        if (isDefined(payload.objectId) && payload.objectId !== event.objectId)
          return false

        return true
      })

      return resolveConnection({
        nodes: events,
        payload: { ...payload, first, last },
        createCursor(node) {
          return node.id.toString()
        },
      })
    },
    async notifications(
      _parent,
      { unread, ...cursorPayload },
      { dataSources, userId }
    ) {
      assertUserIsAuthenticated(userId)
      const { notifications } = await dataSources.model.serlo.getNotifications({
        userId,
      })
      return resolveConnection({
        nodes: notifications
          .filter(isDefined)
          .filter(
            (notification) => unread == null || notification.unread === unread
          ),
        payload: cursorPayload,
        createCursor(node) {
          return `${node.id}`
        },
      })
    },
    notificationEvent(_parent, payload, { dataSources }) {
      return dataSources.model.serlo.getNotificationEvent(payload)
    },
  },
  Mutation: {
    notification: createMutationNamespace(),
  },
  NotificationMutation: {
    async setState(_parent, payload, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { notifications } = await dataSources.model.serlo.getNotifications({
        userId,
      })
      const { id, unread } = payload.input
      const ids = Array.isArray(id) ? id : [id]

      ids.forEach((id) => {
        if (!notifications.find((n) => n.id === id)) {
          throw new ForbiddenError(
            'You are only allowed to set your own notification states.'
          )
        }
      })

      await dataSources.model.serlo.setNotificationState({
        ids,
        userId,
        unread,
      })
      return { success: true, query: {} }
    },
  },
}
