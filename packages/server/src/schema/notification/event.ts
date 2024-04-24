import { Database } from '~/database'
import { AbstractNotificationEvent } from '~/types'

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
  const user = await database.fetchOne('SELECT *  FROM user  WHERE id = ?', [
    actorId,
  ])
  // TODO: start a database transaction!

  if (!user) {
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
    //TODO: map eventtype to raw event type name!!
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

  // TODO: getEvent

  await createNotifications(event, database)
}

interface Subscriber {
  userId: number
  sendEmail: boolean
}

export async function createNotifications(
  event: AbstractNotificationEvent,
  database: Database,
) {
  const { objectId, actor } = event

  // TODO: Get uuidParameters
  const objectIds = [objectId, ...Object.values(uuidParameters)]
  const subscribers: Subscriber[] = []

  for (const objectId of objectIds) {
    let subscriptions = await database.fetchAll<{
      objectId: number
      userId: number
      sendEmail: boolean
    }>(
      `
      SELECT uuid_id AS objectId, user_id AS userId, notify_mailman AS send_email
        FROM subscription WHERE uuid_id = ?
    `,
      [objectId],
    )

    subscriptions = subscriptions.filter(
      (subscription) => subscription.userId !== actor.id,
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
  event: AbstractNotificationEvent,
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
