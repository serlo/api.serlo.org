import { Database } from '~/database'

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

export async function createEvent(
  {
    eventType,
    actorId,
    objectId,
    instance_id,
    date,
    stringParameters,
    uuidParameters,
  }: {
    // TODO: Ideally we type it so that string and uuid parameters are mandatory depending on event type
    eventType: EventType
    actorId: number
    objectId: number
    instance_id: number
    date: Date
    stringParameters: Record<string, string>
    uuidParameters: Record<string, number>
  },
  database: Database,
) {
  try {
    await database.beginTransaction()

    const user = await database.fetchOne('SELECT *  FROM user  WHERE id = ?', [
      actorId,
    ])
    if (!user) {
      await database.rollbackTransaction()
      return Promise.reject(
        new Error(
          'Event cannot be saved because the acting user does not exist.',
        ),
      )
    }

    await database.mutate(
      `
      INSERT INTO event_log (actor_id, event_id, uuid_id, instance_id, date)
        SELECT ?, id, ?, ?, ?
        FROM event
        WHERE name = ?
    `,
      [actorId, objectId, instance_id, date, eventType],
    )
    const eventId = (
      await database.fetchOne<{ id: number }>('SELECT LAST_INSERT_ID() as id')
    ).id

    for (const [parameter, value] of Object.entries(stringParameters)) {
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

      await database.mutate(
        `
        INSERT INTO event_parameter_string (value, event_parameter_id)
          VALUES (?, ?)
      `,
        [value, parameterId],
      )
    }

    for (const [parameter, uuidId] of Object.entries(uuidParameters)) {
      // TODO: shouldn't we add a fk check in the table event_parameter_uuid instead?
      const uuid = await database.fetchOne(
        'SELECT *  FROM uuid  WHERE id = ?',
        [uuidId],
      )
      if (!uuid) {
        await database.rollbackTransaction()
        return Promise.reject(
          new Error(
            `Event cannot be saved because uuid ${uuidId} in uuidParameters does not exist.`,
          ),
        )
      }

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

      await database.mutate(
        `
        INSERT INTO event_parameter_uuid (uuid_id, event_parameter_id)
          VALUES (?, ?)
      `,
        [uuidId, parameterId],
      )
    }

    const event = await getEvent(eventId, database)

    await createNotifications(event, database)

    await database.commitTransaction()

    return event
  } catch (error) {
    await database.rollbackTransaction()
    return Promise.reject(error)
  }
}

interface AbstractEvent {
  actorId: number
  date: Date
  id: number
  instance: string
  objectId: number
  rawTypename: string
  stringParameters: Record<string, string>
  uuidParameters: Record<string, number>
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

  if (!Object.values(EventType).includes(event.name as EventType)) {
    return Promise.reject(
      new Error('Event cannot be fetched because its type is invalid.'),
    )
  }

  // TODO: check if instance is valid?

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

interface Subscriber {
  userId: number
  sendEmail: boolean
}

export async function createNotifications(
  event: AbstractEvent,
  database: Database,
) {
  const { objectId, actorId } = event

  const objectIds = [objectId, ...Object.values(event.uuidParameters)]
  const subscribers: Subscriber[] = []

  for (const objectId of objectIds) {
    let subscriptions = await database.fetchAll<{
      objectId: number
      userId: number
      sendEmail: boolean
    }>(
      `
      SELECT uuid_id AS objectId, user_id AS userId, notify_mailman AS sendEmail
        FROM subscription WHERE uuid_id = ?
    `,
      [objectId],
    )

    subscriptions = subscriptions.filter(
      (subscription) => subscription.userId !== actorId,
    )

    for (const subscription of subscriptions) {
      subscribers.push({
        userId: subscription.userId,
        sendEmail: subscription.sendEmail,
      })
    }

    for (const subscriber of subscribers) {
      await createNotification(event, subscriber, database)
    }
  }
}

async function createNotification(
  event: AbstractEvent,
  subscriber: Subscriber,
  database: Database,
) {
  await database.mutate(
    `
      INSERT INTO notification (user_id, date, email)
        VALUES (?, ?, ?)
    `,
    [subscriber.userId, event.date, subscriber.sendEmail],
  )

  await database.mutate(
    `
      INSERT INTO notification_event (notification_id, event_log_id)
        SELECT LAST_INSERT_ID(), ?
    `,
    [event.id],
  )
}
