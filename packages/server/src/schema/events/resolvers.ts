import * as auth from '@serlo/authorization'

import { DatabaseEventRepresentation, toGraphQLModel } from './event'
import { Context } from '~/context'
import { Service } from '~/context/service'
import { ForbiddenError, UserInputError } from '~/errors'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  decodeId,
} from '~/internals/graphql'
import { fetchScopeOfNotificationEvent } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { Instance, Resolvers } from '~/types'

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
    async events(_parent, payload, context) {
      const limit = 500
      const first = payload.first ?? 10
      const { objectId, actorUsername, instance } = payload
      const after = payload.after ? decodeId({ textId: payload.after }) : null

      const actorId = payload.actorId
        ? payload.actorId
        : actorUsername
          ? (
              await context.dataSources.model.serlo.getAlias({
                path: `/user/profile/${actorUsername}`,
                instance: Instance.De,
              })
            )?.id ?? null
          : null

      if (first > limit)
        throw new UserInputError('first cannot be higher than 500')

      const events = await resolveEventsFromDB(
        { after, objectId, actorId, instance, first: first + 1 },
        context,
      )

      return resolveConnection({
        nodes: events,
        payload,
        limit,
        createCursor: (node) => node.id.toString(),
      })
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

async function resolveEventsFromDB(
  args: {
    after?: number | null
    first: number
    objectId?: number | null
    actorId?: number | null
    instance?: Instance | null
  },
  { database }: Pick<Context, 'database'>,
) {
  const { after, first, objectId, actorId, instance } = args

  const rows = await database.fetchAll<unknown>(
    `
      select
        event_log.id as id,
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
      from event_log
      join event on event.id = event_log.event_id
      join instance on event_log.instance_id = instance.id
      left join event_parameter on event_parameter.log_id = event_log.id
      left join event_parameter_name on event_parameter.name_id = event_parameter_name.id
      left join event_parameter_string on event_parameter_string.event_parameter_id = event_parameter.id
      left join event_parameter_uuid on event_parameter_uuid.event_parameter_id = event_parameter.id
      where
        event_log.id < ?
        and (? is null or event_log.uuid_id = ?)
        and (? is null or event_log.actor_id = ?)
        and (? is null or instance.subdomain = ?)
      group by event_log.id
      order by id desc
      limit ?
    `,
    [
      // 2147483647 is the maximum number of INT in mysql
      after ?? 2147483647,
      objectId ?? null,
      objectId ?? null,
      actorId ?? null,
      actorId ?? null,
      instance ?? null,
      instance ?? null,
      // Since there might be invalidentries in the database we fetch some extra
      // entries and filter them out afterwards
      String(Math.min(first + 50, first * 2 + 1)),
    ],
  )

  const events = rows.filter(DatabaseEventRepresentation.is).map(toGraphQLModel)

  return events.slice(0, first)
}
