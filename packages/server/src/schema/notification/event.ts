import { Context } from '~/context'
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
  id: number
  type: EventType
  actorId: number
  objectId: number
  instance: Instance
  parameters: EventParameter
}

export async function createEvent(
  payload: Omit<AbstractEvent, 'id'>,
  { database }: Pick<Context, 'database'>,
) {
  const { type, actorId, objectId, instance, parameters } = payload

  try {
    await database.beginTransaction()

    const { insertId: eventId } = await database.mutate(
      `
      INSERT INTO event_log (actor_id, event_id, uuid_id, instance_id)
        SELECT ?, event.id, ?, instance.id
        FROM event, instance
        WHERE event.name = ? and instance.subdomain = ?
      `,
      [actorId, objectId, type, instance],
    )

    for (const [parameter, value] of Object.entries(parameters)) {
      const { insertId: parameterId } = await database.mutate(
        `
          INSERT INTO event_parameter (log_id, name_id)
            SELECT ?, id
            FROM event_parameter_name
            WHERE name = ?
        `,
        [eventId, parameter],
      )

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

    const event = { ...payload, id: eventId }

    await createNotifications(event, { database })

    await database.commitLastTransaction()

    return event
  } catch (error) {
    await database.rollbackLastTransaction()
    return Promise.reject(error)
  }
}

async function createNotifications(
  event: AbstractEvent,
  { database }: Pick<Context, 'database'>,
) {
  const { objectId, actorId } = event

  const uuidParameters = Object.values(event.parameters).filter(isNumber)
  const objectIds = [objectId, ...uuidParameters]
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

function isNumber(x: unknown): x is number {
  return typeof x === 'number'
}
