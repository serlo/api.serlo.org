import * as auth from '@serlo/authorization'

import { Context } from '~/context'
import { Service } from '~/context/service'
import { ForbiddenError, UserInputError } from '~/errors'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
} from '~/internals/graphql'
import { fetchScopeOfNotificationEvent } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { Instance, Resolvers, QueryEventsArgs } from '~/types'

export const resolvers: Resolvers = {
  AbstractNotificationEvent: {
    __resolveType(notificationEvent) {
      return notificationEvent.__typename
    },
  },
  Notification: {
    async event(parent, _args, { dataSources }) {
      return await dataSources.model.serlo.getNotificationEvent({
        id: parent.eventId,
      })
    },
  },
  Query: {
    events(_parent, payload, { dataSources }) {
      return resolveEvents({ payload, dataSources })
    },
    async notifications(
      _parent,
      { userId: requestedUserId, unread, emailSent, email, ...cursorPayload },
      { dataSources, service, userId: authUserId },
    ) {
      let userId: number

      if (!requestedUserId) {
        assertUserIsAuthenticated(authUserId)
        userId = authUserId
      } else {
        if (service !== Service.NotificationEmailService) {
          throw new UserInputError(
            "Service is not allowed to query user's notifications",
          )
        }
        userId = requestedUserId
      }

      const { notifications } = await dataSources.model.serlo.getNotifications({
        userId,
      })

      const filteredNotifications = notifications.filter(
        (notification) =>
          (unread == null || notification.unread === unread) &&
          (email == null || notification.email === email) &&
          (emailSent == null || notification.emailSent === emailSent),
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
    async setState(_parent, payload, context) {
      const { dataSources, userId } = context
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
            'You are only allowed to set your own notification states.',
          )
        }
        return notification.eventId
      })

      const scopes = await Promise.all(
        eventIds.map((id) => fetchScopeOfNotificationEvent({ id }, context)),
      )

      await assertUserIsAuthorized({
        guards: scopes.map((scope) => auth.Notification.setState(scope)),
        message:
          'You are not allowed to set the state of the provided notification(s).',
        context,
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
  const { after, objectId, actorId, actorUsername, instance } = payload

  if (first > limit) throw new UserInputError('first cannot be higher than 500')

  const { events, hasNextPage } = await dataSources.model.serlo.getEvents({
    first: 2 * limit + 50,
    objectId: objectId ?? undefined,
    actorId:
      actorId ??
      (actorUsername
        ? (
            await dataSources.model.serlo.getAlias({
              path: `/user/profile/${actorUsername}`,
              instance: Instance.De,
            })
          )?.id
        : undefined),
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
      pageInfo: { ...pageInfo, hasNextPage },
    }
  }
}
