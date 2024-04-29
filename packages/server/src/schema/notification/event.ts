import { Context } from '~/context'
import { Model } from '~/internals/graphql'
import { NotificationEventType } from '~/model/decoder'
import { Instance } from '~/types'

export enum EventType {
  // TODO: I cannot map the following type to an API event
  // ArchiveThread = 'discussion/comment/archive',
  // RestoreThread = 'discussion/restore',
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

export type AbstractEvent =
  | AbstractCreateCommentEvent
  | AbstractCreateThreadEvent
  | AbstractCreateEntityEvent
  | AbstractSetLicenseEvent
type ConcreteEvent =
  | Model<'CreateCommentNotificationEvent'>
  | Model<'CreateThreadNotificationEvent'>
  | Model<'CreateEntityNotificationEvent'>
  | Model<'SetLicenseNotificationEvent'>
type AbstractEventPayload =
  | Omit<AbstractCreateCommentEvent, 'id' | 'date'>
  | Omit<AbstractCreateThreadEvent, 'id' | 'date'>
  | Omit<AbstractCreateEntityEvent, 'id' | 'date'>
  | Omit<AbstractSetLicenseEvent, 'id' | 'date'>
type ConcreteEventPayload =
  | Omit<Model<'CreateCommentNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<Model<'CreateThreadNotificationEvent'>, 'id' | 'date'>
  | Omit<Model<'CreateEntityNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<Model<'SetLicenseNotificationEvent'>, 'id' | 'date' | 'objectId'>

type AbstractCreateCommentEvent = AbstractEventType<
  EventType.CreateComment,
  { discussion: number }
>
type AbstractCreateThreadEvent = AbstractEventType<
  EventType.CreateThread,
  { on: number }
>
type AbstractCreateEntityEvent = AbstractEventType<
  EventType.CreateEntity,
  Record<string, never>
>
type AbstractSetLicenseEvent = AbstractEventType<
  EventType.SetLicense,
  Record<string, never>
>

interface AbstractEventType<T extends EventType, P> {
  id: number
  type: T
  actorId: number
  date: string
  objectId: number
  instance: Instance
  parameters: P
}

export function toConcreteEvent(event: AbstractEvent): ConcreteEvent {
  if (event.type === EventType.CreateComment) {
    return {
      ...event,
      __typename: NotificationEventType.CreateComment,
      threadId: event.parameters['discussion'],
      commentId: event.objectId,
    }
  } else if (event.type === EventType.CreateThread) {
    return {
      ...event,
      __typename: NotificationEventType.CreateThread,
      objectId: event.parameters['on'],
      threadId: event.objectId,
    }
  } else if (event.type === EventType.CreateEntity) {
    return {
      ...event,
      __typename: NotificationEventType.CreateEntity,
      entityId: event.objectId,
    }
  } else if (event.type === EventType.SetLicense) {
    return {
      ...event,
      __typename: NotificationEventType.SetLicense,
      repositoryId: event.objectId,
    }
  }

  // TODO
  throw new Error()
}

function toAbstractEventPayload(
  event: ConcreteEventPayload,
): AbstractEventPayload {
  if (event.__typename === NotificationEventType.CreateComment) {
    return {
      ...event,
      type: EventType.CreateComment,
      objectId: event.commentId,
      parameters: { discussion: event.threadId },
    }
  } else if (event.__typename === NotificationEventType.CreateThread) {
    return {
      ...event,
      type: EventType.CreateThread,
      objectId: event.threadId,
      parameters: { on: event.objectId },
    }
  } else if (event.__typename === NotificationEventType.CreateEntity) {
    return {
      ...event,
      type: EventType.CreateEntity,
      objectId: event.entityId,
      parameters: {},
    }
  } else if (event.__typename === NotificationEventType.SetLicense) {
    return {
      ...event,
      type: EventType.CreateEntity,
      objectId: event.repositoryId,
      parameters: {},
    }
  }

  throw new Error()
}

export async function createEvent(
  payload: ConcreteEventPayload,
  { database }: Pick<Context, 'database'>,
) {
  const abstractEventPayload = toAbstractEventPayload(payload)
  const { type, actorId, objectId, instance, parameters } = abstractEventPayload

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

    const event = { ...abstractEventPayload, id: eventId }

    await createNotifications(event, { database })

    await database.commitLastTransaction()
  } catch (error) {
    await database.rollbackLastTransaction()
    return Promise.reject(error)
  }
}

async function createNotifications(
  event: Omit<AbstractEvent, 'date'>,
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
