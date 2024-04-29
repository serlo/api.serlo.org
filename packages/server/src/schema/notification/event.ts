import * as R from 'ramda'

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
  | AbstractCreateEntityLinkEvent
  | AbstractRemoveEntityLinkEvent
type ConcreteEvent =
  | Model<'CreateCommentNotificationEvent'>
  | Model<'CreateThreadNotificationEvent'>
  | Model<'CreateEntityNotificationEvent'>
  | Model<'SetLicenseNotificationEvent'>
  | Model<'CreateEntityLinkNotificationEvent'>
  | Model<'RemoveEntityLinkNotificationEvent'>
type AbstractEventPayload =
  | Omit<AbstractCreateCommentEvent, 'id' | 'date'>
  | Omit<AbstractCreateThreadEvent, 'id' | 'date'>
  | Omit<AbstractCreateEntityEvent, 'id' | 'date'>
  | Omit<AbstractSetLicenseEvent, 'id' | 'date'>
  | Omit<AbstractCreateEntityLinkEvent, 'id' | 'date'>
  | Omit<AbstractRemoveEntityLinkEvent, 'id' | 'date'>
type ConcreteEventPayload =
  | Omit<Model<'CreateCommentNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<Model<'CreateThreadNotificationEvent'>, 'id' | 'date'>
  | Omit<Model<'CreateEntityNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<Model<'SetLicenseNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<Model<'CreateEntityLinkNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<Model<'RemoveEntityLinkNotificationEvent'>, 'id' | 'date' | 'objectId'>

type AbstractCreateCommentEvent = AbstractEventType<
  EventType.CreateComment,
  { discussion: number },
  Record<string, never>
>
type AbstractCreateThreadEvent = AbstractEventType<
  EventType.CreateThread,
  { on: number },
  Record<string, never>
>
type AbstractCreateEntityEvent = AbstractEventType<
  EventType.CreateEntity,
  Record<string, never>,
  Record<string, never>
>
type AbstractSetLicenseEvent = AbstractEventType<
  EventType.SetLicense,
  Record<string, never>,
  Record<string, never>
>
type AbstractCreateEntityLinkEvent = AbstractEventType<
  EventType.CreateEntityLink,
  { parent: number },
  Record<string, never>
>
type AbstractRemoveEntityLinkEvent = AbstractEventType<
  EventType.RemoveEntityLink,
  { parent: number },
  Record<string, never>
>

interface AbstractEventType<
  Type extends EventType,
  UuidParameters extends Record<string, number>,
  StringParameters extends Record<string, string>,
> {
  id: number
  type: Type
  actorId: number
  date: Date
  objectId: number
  instance: Instance
  uuidParameters: UuidParameters
  stringParameters: StringParameters
}

export function toConcreteEvent(event: AbstractEvent): ConcreteEvent {
  const base = {
    ...R.pick(['id', 'actorId', 'instance', 'objectId'], event),
    date: event.date.toISOString(),
  }

  if (event.type === EventType.CreateComment) {
    return {
      ...base,
      __typename: NotificationEventType.CreateComment,
      threadId: event.uuidParameters['discussion'],
      commentId: event.objectId,
    }
  } else if (event.type === EventType.CreateThread) {
    return {
      ...base,
      __typename: NotificationEventType.CreateThread,
      objectId: event.uuidParameters['on'],
      threadId: event.objectId,
    }
  } else if (event.type === EventType.CreateEntity) {
    return {
      ...base,
      __typename: NotificationEventType.CreateEntity,
      entityId: event.objectId,
    }
  } else if (event.type === EventType.SetLicense) {
    return {
      ...base,
      __typename: NotificationEventType.SetLicense,
      repositoryId: event.objectId,
    }
  } else if (
    event.type === EventType.CreateEntityLink ||
    event.type === EventType.RemoveEntityLink
  ) {
    return {
      ...base,
      __typename:
        event.type === EventType.CreateEntityLink
          ? NotificationEventType.CreateEntityLink
          : NotificationEventType.RemoveEntityLink,
      childId: event.objectId,
      parentId: event.uuidParameters['parent'],
    }
  }

  // TODO
  throw new Error()
}

function toAbstractEventPayload(
  event: ConcreteEventPayload,
): AbstractEventPayload {
  const base = {
    ...R.pick(['actorId', 'instance'], event),
    uuidParameters: {},
    stringParameters: {},
  }

  if (event.__typename === NotificationEventType.CreateComment) {
    return {
      ...base,
      type: EventType.CreateComment,
      objectId: event.commentId,
      uuidParameters: { discussion: event.threadId },
    }
  } else if (event.__typename === NotificationEventType.CreateThread) {
    return {
      ...base,
      type: EventType.CreateThread,
      objectId: event.threadId,
      uuidParameters: { on: event.objectId },
    }
  } else if (event.__typename === NotificationEventType.CreateEntity) {
    return { ...base, type: EventType.CreateEntity, objectId: event.entityId }
  } else if (event.__typename === NotificationEventType.SetLicense) {
    return {
      ...base,
      type: EventType.CreateEntity,
      objectId: event.repositoryId,
    }
  } else if (
    event.__typename === NotificationEventType.CreateEntityLink ||
    event.__typename === NotificationEventType.RemoveEntityLink
  ) {
    return {
      ...base,
      type:
        event.__typename === NotificationEventType.CreateEntityLink
          ? EventType.CreateEntityLink
          : EventType.RemoveEntityLink,
      objectId: event.childId,
      uuidParameters: { parent: event.parentId },
    }
  }

  throw new Error()
}

export async function createEvent(
  payload: ConcreteEventPayload,
  { database }: Pick<Context, 'database'>,
) {
  const abstractEventPayload = toAbstractEventPayload(payload)
  const { type, actorId, objectId, instance } = abstractEventPayload

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

    const { stringParameters, uuidParameters } = abstractEventPayload
    const parameters = { ...stringParameters, ...uuidParameters }

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
