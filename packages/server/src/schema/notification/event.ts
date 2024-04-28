import { Database } from '~/database'
import { Instance } from '~/types'

export enum EventType {
  ArchiveThread = 'discussion/comment/archive',
  RestoreThread = 'discussion/restore',
  CreateComment = 'discussion/comment/create',
  CreateThread = 'discussion/create',
  CreateEntity = 'entity/create',
  SetLicense = 'license/object/set',
  CreateEntityLink = 'entity/link/create',
  RemoveEntityLink = 'entity/link/remove',
  CreateEntityRevision = 'entity/revision/add',
  CheckoutRevision = 'entity/revision/checkout',
  RejectRevision = 'entity/revision/reject',
  CreateTaxonomyLink = 'taxonomy/term/associate',
  RemoveTaxonomyLink = 'taxonomy/term/dissociate',
  CreateTaxonomyTerm = 'taxonomy/term/create',
  SetTaxonomyTerm = 'taxonomy/term/update',
  SetTaxonomyParent = 'taxonomy/term/parent/change',
  RestoreUuid = 'uuid/restore',
  TrashUuid = 'uuid/trash',
}

interface EventParameter {
  object?: string | number
  repository?: string | number
  parent?: string | number
  on?: string | number
  discussion?: string | number
  reason?: string | number
  from?: string | number
  to?: string | number
}

interface AbstractEvent {
  type: EventType
  actorId: number
  objectId: number
  instance: Instance
  parameters: EventParameter
}

export async function createEvent(
  { type, actorId, objectId, instance, parameters }: AbstractEvent,
  database: Database,
) {
  try {
    await database.beginTransaction()

    const user = await database.fetchOne('SELECT *  FROM user  WHERE id = ?', [
      actorId,
    ])
    if (!user) {
      await database.rollbackLastTransaction()
      return Promise.reject(
        new Error(
          'Event cannot be saved because the acting user does not exist.',
        ),
      )
    }

    await database.mutate(
      `
      INSERT INTO event_log (actor_id, event_id, uuid_id, instance_id)
        SELECT ?, event.id, ?, instance.id
        FROM event, instance
        WHERE event.name = ? and instance.subdomain = ?
      `,
      [actorId, objectId, type, instance],
    )

    const eventId = (
      await database.fetchOne<{ id: number }>('SELECT LAST_INSERT_ID() as id')
    ).id

    for (const [parameter, value] of Object.entries(parameters)) {
      await database.mutate(
        `
          INSERT INTO event_parameter (log_id, name_id)
            SELECT ?, id
            FROM event_parameter_name
            WHERE name = ?
        `,
        [eventId, parameter],
      )

      const parameterId = (
        await database.fetchOne<{ id: number }>('SELECT LAST_INSERT_ID() as id')
      ).id

      if (typeof value === 'string') {
        await database.mutate(
          `
            INSERT INTO event_parameter_string (value, event_parameter_id)
              VALUES (?, ?)
          `,
          [value, parameterId],
        )
      } else {
        await database.mutate(
          `
            INSERT INTO event_parameter_uuid (uuid_id, event_parameter_id)
              VALUES (?, ?)
          `,
          [value, parameterId],
        )
      }
    }

    const event = await getEvent(eventId, database)

    await createNotifications(event, database)

    await database.commitLastTransaction()

    return event
  } catch (error) {
    await database.rollbackLastTransaction()
    return Promise.reject(error)
  }
}

export async function getEvent(id: number, database: Database) {
  const event = await database.fetchOne<{
    id: number
    actor_id: number
    uuid_id: number
    date: string
    subdomain: string
    name: string
  }>(
    `
    SELECT l.id, l.actor_id, l.uuid_id, l.date, i.subdomain, e.name
      FROM event_log l
      LEFT JOIN event_parameter p ON l.id = p.log_id
      JOIN instance i ON l.instance_id = i.id
      JOIN event e ON l.event_id = e.id
      WHERE l.id = ?
    `,
    [id],
  )
  if (!event) {
    return Promise.reject(new Error('No event found'))
  }

  if (!Object.values(EventType).includes(event.name as EventType)) {
    return Promise.reject(
      new Error('Event cannot be fetched because its type is invalid.'),
    )
  }

  const stringParametersRaw = await database.fetchAll<{
    name: string
    value: string
  }>(
    `
    SELECT n.name, s.value
      FROM event_parameter p
      JOIN event_parameter_name n ON n.id = p.name_id
      JOIN event_parameter_string s ON s.event_parameter_id = p.id
      WHERE p.name_id = n.id AND p.log_id = ?
    `,
    [id],
  )

  const stringParameters: Record<string, string> = {}

  for (const param of stringParametersRaw) {
    stringParameters[param.name] = param.value
  }

  const uuidParametersRaw = await database.fetchAll<{
    name: string
    uuid_id: number
  }>(
    `
    SELECT n.name, u.uuid_id
      FROM event_parameter p
      JOIN event_parameter_name n ON n.id = p.name_id
      JOIN event_parameter_uuid u ON u.event_parameter_id = p.id
      WHERE p.name_id = n.id AND p.log_id = ?`,
    [id],
  )

  const uuidParameters: Record<string, number> = {}

  for (const param of uuidParametersRaw) {
    uuidParameters[param.name] = param.uuid_id
  }

  return {
    __typename: event.name,
    id: event.id,
    instance: event.subdomain,
    date: new Date(event.date),
    actorId: event.actor_id,
    objectId: event.uuid_id,
    rawTypename: event.name,
    stringParameters,
    uuidParameters,
  }
}

export async function createNotifications(
  event: {
    actorId: number
    id: number
    objectId: number
    uuidParameters: Record<string, number>
  },
  database: Database,
) {
  const { objectId, actorId } = event

  const objectIds = [objectId, ...Object.values(event.uuidParameters)]
  const subscribers = []

  for (const objectId of objectIds) {
    const subscriptions = await database.fetchAll<{
      uuid_id: number
      user_id: number
      notify_mailman: boolean
    }>(
      `
      SELECT uuid_id, user_id, notify_mailman
        FROM subscription WHERE uuid_id = ? AND user_id != ?
    `,
      [objectId, actorId],
    )

    for (const subscription of subscriptions) {
      subscribers.push({
        userId: subscription.user_id,
        sendEmail: subscription.notify_mailman,
      })
    }
  }

  for (const subscriber of subscribers) {
    await database.mutate(
      `
        INSERT INTO notification (user_id, email)
          VALUES (?, ?)
      `,
      [subscriber.userId, subscriber.sendEmail],
    )

    await database.mutate(
      `
        INSERT INTO notification_event (notification_id, event_log_id)
          SELECT LAST_INSERT_ID(), ?
      `,
      [event.id],
    )
  }
}
