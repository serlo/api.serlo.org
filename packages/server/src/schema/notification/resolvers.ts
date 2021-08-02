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
import * as auth from '@serlo/authorization'
import { ForbiddenError, UserInputError } from 'apollo-server'

import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  Context,
  createNamespace,
  InterfaceResolvers,
  Mutations,
  Queries,
  TypeResolvers,
} from '~/internals/graphql'
import { fetchScopeOfNotificationEvent } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { Notification, QueryEventsArgs } from '~/types'

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
    events(_parent, payload, { dataSources }) {
      return resolveEvents({ payload, dataSources })
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
      const filteredNotifications = notifications.filter(
        (notification) => unread == null || notification.unread === unread
      )
      return resolveConnection({
        nodes: filteredNotifications,
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
    notification: createNamespace(),
  },
  NotificationMutation: {
    async setState(_parent, payload, { dataSources, userId }) {
      const { id, unread } = payload.input
      const ids = id

      assertUserIsAuthenticated(userId)
      const { notifications } = await dataSources.model.serlo.getNotifications({
        userId,
      })
      const eventIds = ids.map((id) => {
        const notification = notifications.find((n) => n.id === id)
        if (!notification) {
          throw new ForbiddenError(
            'You are only allowed to set your own notification states.'
          )
        }
        return notification.eventId
      })

      const scopes = await Promise.all(
        eventIds.map((id) => fetchScopeOfNotificationEvent({ id, dataSources }))
      )

      await assertUserIsAuthorized({
        userId,
        guards: scopes.map((scope) => auth.Notification.setState(scope)),
        message:
          'You are not allowed to set the state of the provided notification(s).',
        dataSources,
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

export async function resolveEvents({
  payload,
  dataSources,
}: {
  payload: QueryEventsArgs
  dataSources: Context['dataSources']
}) {
  const limit = 500
  const first = payload.first ?? limit
  const { after, objectId, actorId, instance } = payload

  if (first > limit) throw new UserInputError('first cannot be higher than 500')

  const { events, hasNextPage } = await dataSources.model.serlo.getEvents({
    first: 2 * limit + 50,
    objectId: objectId ?? undefined,
    actorId: actorId ?? undefined,
    instance: instance ?? undefined,
  })

  const connection = resolveConnection({
    nodes: events,
    payload,
    limit,
    createCursor: (node) => node.id.toString(),
  })

  if (!hasNextPage || connection.nodes.length === first) {
    const { pageInfo } = connection

    return {
      ...connection,
      pageInfo: {
        ...pageInfo,
        __typename: 'HasNextPageInfo' as const,
        hasNextPage: pageInfo.hasNextPage || hasNextPage,
      },
    }
  } else {
    if (after == null) throw new Error('illegal state')

    const { events, hasNextPage } =
      await dataSources.model.serlo.getEventsAfter({
        first,
        after: parseInt(Buffer.from(after, 'base64').toString('utf-8')),
        objectId: objectId ?? undefined,
        actorId: actorId ?? undefined,
        instance: instance ?? undefined,
      })

    const connection = resolveConnection({
      nodes: events,
      payload,
      limit,
      createCursor: (node) => node.id.toString(),
    })
    const { pageInfo } = connection

    return {
      ...connection,
      pageInfo: {
        ...pageInfo,
        hasNextPage,
        __typename: 'HasNextPageInfo' as const,
      },
    }
  }
}
