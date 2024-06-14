import { DatabaseEventRepresentation, toGraphQLModel } from './event'
import { Context } from '~/context'
import { UserInputError } from '~/errors'
import { decodeId } from '~/internals/graphql'
import { resolveConnection } from '~/schema/connection/utils'
import { resolveIdFromUsername } from '~/schema/uuid/user/resolvers'
import { Instance, Resolvers } from '~/types'

export const resolvers: Resolvers = {
  AbstractNotificationEvent: {
    __resolveType(notificationEvent) {
      return notificationEvent.__typename
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
          ? await resolveIdFromUsername(actorUsername, context)
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
        event.id as id,
        event_type.name as type,
        event.actor_id as actorId,
        instance.subdomain as instance,
        event.date as date,
        event.uuid_id as objectId,
        event.uuid_parameter as uuidParameter,
        event.uuid_parameter2 as uuidParameter2,
        event.string_parameter as stringParameter
      from event
      join event_type on event_type.id = event.event_type_id
      join instance on event.instance_id = instance.id
      where
        event.id < ?
        and (? is null or event.uuid_id = ? or event.uuid_parameter = ?
            or event.uuid_parameter2 = ?)
        and (? is null or event.actor_id = ?)
        and (? is null or instance.subdomain = ?)
      group by event.id
      order by id desc
      limit ?
    `,
    [
      // 2147483647 is the maximum number of INT in mysql
      after ?? 2147483647,
      objectId ?? null,
      objectId ?? null,
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
