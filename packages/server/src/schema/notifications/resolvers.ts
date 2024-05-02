import * as auth from '@serlo/authorization'
import { option as O } from 'fp-ts'
import * as t from 'io-ts'

import { DatabaseEventRepresentation, toGraphQLModel } from '../events/event'
import { createCachedResolver } from '~/cached-resolver'
import { Service } from '~/context/service'
import { ForbiddenError, UserInputError } from '~/errors'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
} from '~/internals/graphql'
import { NotificationDecoder } from '~/model/decoder'
import { fetchScopeOfNotificationEvent } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { Resolvers } from '~/types'

export const NotificationsResolver = createCachedResolver({
  name: 'NotificationsResolver',
  decoder: t.array(NotificationDecoder),
  enableSwr: true,
  staleAfter: { minutes: 1 },
  maxAge: { minutes: 15 },
  getKey: ({ userId }) => {
    return `notifications/${userId}`
  },
  getPayload: (key) => {
    if (!key.startsWith('notifications/')) return O.none
    const userId = parseInt(key.replace('notifications/', ''), 10)
    return O.some({ userId })
  },
  examplePayload: { userId: 1 },
  async getCurrentValue({ userId }, { database }) {
    interface Row {
      id: number
      seen: 0 | 1
      emailSent: 0 | 1
      email: 0 | 1
      eventId: number
    }

    const rows = await database.fetchAll<Row>(
      `
        select
          notification.id,
          notification.seen,
          notification.email_sent as emailSent,
          notification.email,
          event_log.id as eventId,
          event.name as type,
          event_log.actor_id as actorId,
          instance.subdomain as instance,
          event_log.date as date,
          event_log.uuid_id as objectId,
          JSON_OBJECTAGG(
            COALESCE(event_parameter_name.name, "__unused"),
            event_parameter_uuid.uuid_id
          ) as uuidParameters,
          JSON_OBJECTAGG(
            COALESCE(event_parameter_name.name, "__unused"),
            event_parameter_string.value
          ) as stringParameters
        from notification
        join notification_event ON notification.id = notification_event.notification_id
        join event_log on event_log.id = notification_event.event_log_id
        join event on event.id = event_log.event_id
        join instance on event_log.instance_id = instance.id
        left join event_parameter on event_parameter.log_id = event_log.id
        left join event_parameter_name on event_parameter.name_id = event_parameter_name.id
        left join event_parameter_string on event_parameter_string.event_parameter_id = event_parameter.id
        left join event_parameter_uuid on event_parameter_uuid.event_parameter_id = event_parameter.id
        where notification.user_id = ?
        group by notification.id, event_log.id
        order by notification.date desc, notification.id desc
      `,
      [userId],
    )

    return rows
      .map((row) => {
        const { id, seen, emailSent, email, eventId, ...rest } = row
        const abstractEvent = { id: eventId, ...rest }

        return {
          id,
          unread: !seen,
          emailSent: Boolean(emailSent),
          email: Boolean(email),
          event: DatabaseEventRepresentation.is(abstractEvent)
            ? toGraphQLModel(abstractEvent)
            : null,
        }
      })
      .filter(NotificationDecoder.is)
  },
})

export const resolvers: Resolvers = {
  Query: {
    async notifications(_parent, payload, context) {
      const { userId: requestedUserId, unread, emailSent, email } = payload
      const { service, userId: authUserId } = context
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

      const notifications = await NotificationsResolver.resolve(
        { userId },
        context,
      )

      const filteredNotifications = notifications.filter(
        (notification) =>
          (unread == null || notification.unread === unread) &&
          (email == null || notification.email === email) &&
          (emailSent == null || notification.emailSent === emailSent),
      )

      return resolveConnection({
        nodes: filteredNotifications,
        payload,
        createCursor: (node) => `${node.id}`,
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
      const notifications = await NotificationsResolver.resolve(
        { userId },
        context,
      )
      const eventIds = ids.map((id) => {
        const notification = notifications.find((n) => n.id === id)
        if (!notification) {
          throw new ForbiddenError(
            'You are only allowed to set your own notification states.',
          )
        }
        return notification.event.id
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
