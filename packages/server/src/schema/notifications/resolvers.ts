import * as auth from '@serlo/authorization'

import { Service } from '~/context/service'
import { ForbiddenError, UserInputError } from '~/errors'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
} from '~/internals/graphql'
import { fetchScopeOfNotificationEvent } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  Notification: {
    async event(parent, _args, { dataSources }) {
      return await dataSources.model.serlo.getNotificationEvent({
        id: parent.eventId,
      })
    },
  },
  Query: {
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
