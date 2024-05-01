import { DatabaseEventRepresentation, toGraphQLModel } from './event'
import { Context } from '~/context'
import { UserInputError } from '~/errors'
import { decodeId } from '~/internals/graphql'
import { resolveConnection } from '~/schema/connection/utils'
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
