import * as R from 'ramda'

import { Context } from '~/context'
import { Model } from '~/internals/graphql'
import { NotificationEventType } from '~/model/decoder'
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

export type DatabaseEventRepresentation =
  DatabaseEventRepresentations[keyof DatabaseEventRepresentations]

type PayloadForNewAbstractEvent = {
  [P in keyof DatabaseEventRepresentations]: Omit<
    DatabaseEventRepresentations[P],
    'id' | 'date'
  >
}[keyof DatabaseEventRepresentations]

type GraphQLEventModels =
  | Model<'SetThreadStateNotificationEvent'>
  | Model<'CreateCommentNotificationEvent'>
  | Model<'CreateThreadNotificationEvent'>
  | Model<'CreateEntityNotificationEvent'>
  | Model<'SetLicenseNotificationEvent'>
  | Model<'CreateEntityLinkNotificationEvent'>
  | Model<'RemoveEntityLinkNotificationEvent'>
  | Model<'CreateEntityRevisionNotificationEvent'>
  | Model<'CheckoutRevisionNotificationEvent'>
  | Model<'RejectRevisionNotificationEvent'>
  | Model<'CreateTaxonomyLinkNotificationEvent'>
  | Model<'RemoveTaxonomyLinkNotificationEvent'>
  | Model<'CreateTaxonomyTermNotificationEvent'>
  | Model<'SetTaxonomyTermNotificationEvent'>
  | Model<'SetTaxonomyParentNotificationEvent'>
  | Model<'SetUuidStateNotificationEvent'>

type PayloadForNewConcreteEvent =
  | Omit<Model<'SetThreadStateNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<Model<'CreateCommentNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<Model<'CreateThreadNotificationEvent'>, 'id' | 'date'>
  | Omit<Model<'CreateEntityNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<Model<'SetLicenseNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<Model<'CreateEntityLinkNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<Model<'RemoveEntityLinkNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<
      Model<'CreateEntityRevisionNotificationEvent'>,
      'id' | 'date' | 'objectId'
    >
  | Omit<Model<'CheckoutRevisionNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<Model<'RejectRevisionNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<
      Model<'CreateTaxonomyLinkNotificationEvent'>,
      'id' | 'date' | 'objectId'
    >
  | Omit<
      Model<'RemoveTaxonomyLinkNotificationEvent'>,
      'id' | 'date' | 'objectId'
    >
  | Omit<
      Model<'CreateTaxonomyTermNotificationEvent'>,
      'id' | 'date' | 'objectId'
    >
  | Omit<Model<'SetTaxonomyTermNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<
      Model<'SetTaxonomyParentNotificationEvent'>,
      'id' | 'date' | 'objectId'
    >
  | Omit<Model<'SetUuidStateNotificationEvent'>, 'id' | 'date'>

interface DatabaseEventRepresentations {
  ArchiveThread: DatabaseEventRepresentationType<
    EventType.ArchiveThread,
    Record<string, never>,
    Record<string, never>
  >
  RestoreThread: DatabaseEventRepresentationType<
    EventType.RestoreThread,
    Record<string, never>,
    Record<string, never>
  >
  CreateComment: DatabaseEventRepresentationType<
    EventType.CreateComment,
    { discussion: number },
    Record<string, never>
  >
  CreateThread: DatabaseEventRepresentationType<
    EventType.CreateThread,
    { on: number },
    Record<string, never>
  >
  CreateEntity: DatabaseEventRepresentationType<
    EventType.CreateEntity,
    Record<string, never>,
    Record<string, never>
  >
  SetLicense: DatabaseEventRepresentationType<
    EventType.SetLicense,
    Record<string, never>,
    Record<string, never>
  >
  CreateEntityLink: DatabaseEventRepresentationType<
    EventType.CreateEntityLink,
    { parent: number },
    Record<string, never>
  >
  RemoveEntityLink: DatabaseEventRepresentationType<
    EventType.RemoveEntityLink,
    { parent: number },
    Record<string, never>
  >
  CreateEntityRevision: DatabaseEventRepresentationType<
    EventType.CreateEntityRevision,
    { repository: number },
    Record<string, never>
  >
  CheckoutRevision: DatabaseEventRepresentationType<
    EventType.CheckoutRevision,
    { repository: number },
    { reason: string }
  >
  RejectRevision: DatabaseEventRepresentationType<
    EventType.RejectRevision,
    { repository: number },
    { reason: string }
  >
  CreateTaxonomyLink: DatabaseEventRepresentationType<
    EventType.CreateTaxonomyLink,
    { object: number },
    Record<string, never>
  >
  RemoveTaxonomyLink: DatabaseEventRepresentationType<
    EventType.RemoveTaxonomyLink,
    { object: number },
    Record<string, never>
  >
  CreateTaxonomyTerm: DatabaseEventRepresentationType<
    EventType.CreateTaxonomyTerm,
    Record<string, never>,
    Record<string, never>
  >
  SetTaxonomyTerm: DatabaseEventRepresentationType<
    EventType.SetTaxonomyTerm,
    Record<string, never>,
    Record<string, never>
  >
  SetTaxonomyParent: DatabaseEventRepresentationType<
    EventType.SetTaxonomyParent,
    { from: number | null; to: number | null },
    Record<string, never>
  >
  TrashUuid: DatabaseEventRepresentationType<
    EventType.TrashUuid,
    Record<string, never>,
    Record<string, never>
  >
  RestoreUuid: DatabaseEventRepresentationType<
    EventType.RestoreUuid,
    Record<string, never>,
    Record<string, never>
  >
}

interface DatabaseEventRepresentationType<
  Type extends EventType,
  UuidParameters extends Record<string, number | null>,
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

export function toGraphQLModel(
  event: DatabaseEventRepresentation,
): GraphQLEventModels {
  const base = {
    ...R.pick(['id', 'actorId', 'instance', 'objectId'], event),
    date: event.date.toISOString(),
  }

  if (
    event.type === EventType.ArchiveThread ||
    event.type === EventType.RestoreThread
  ) {
    return {
      ...base,
      __typename: NotificationEventType.SetThreadState,
      threadId: event.objectId,
      archived: event.type === EventType.ArchiveThread,
    }
  } else if (event.type === EventType.CreateComment) {
    return {
      ...base,
      __typename: NotificationEventType.CreateComment,
      threadId: event.uuidParameters.discussion,
      commentId: event.objectId,
    }
  } else if (event.type === EventType.CreateThread) {
    return {
      ...base,
      __typename: NotificationEventType.CreateThread,
      objectId: event.uuidParameters.on,
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
      parentId: event.uuidParameters.parent,
    }
  } else if (event.type === EventType.CreateEntityRevision) {
    return {
      ...base,
      __typename: NotificationEventType.CreateEntityRevision,
      entityId: event.uuidParameters.repository,
      entityRevisionId: event.objectId,
    }
  } else if (
    event.type === EventType.CheckoutRevision ||
    event.type === EventType.RejectRevision
  ) {
    return {
      ...base,
      __typename:
        event.type === EventType.CheckoutRevision
          ? NotificationEventType.CheckoutRevision
          : NotificationEventType.RejectRevision,
      repositoryId: event.uuidParameters.repository,
      revisionId: event.objectId,
      reason: event.stringParameters.reason,
    }
  } else if (
    event.type === EventType.CreateTaxonomyLink ||
    event.type === EventType.RemoveTaxonomyLink
  ) {
    return {
      ...base,
      __typename:
        event.type === EventType.CreateTaxonomyLink
          ? NotificationEventType.CreateTaxonomyLink
          : NotificationEventType.RemoveTaxonomyLink,
      parentId: event.objectId,
      childId: event.uuidParameters.object,
    }
  } else if (
    event.type === EventType.CreateTaxonomyTerm ||
    event.type === EventType.SetTaxonomyTerm
  ) {
    return {
      ...base,
      __typename:
        event.type === EventType.CreateTaxonomyTerm
          ? NotificationEventType.CreateTaxonomyTerm
          : NotificationEventType.SetTaxonomyTerm,
      taxonomyTermId: event.objectId,
    }
  } else if (event.type === EventType.SetTaxonomyParent) {
    return {
      ...base,
      __typename: NotificationEventType.SetTaxonomyParent,
      childId: event.objectId,
      previousParentId: event.uuidParameters.from,
      parentId: event.uuidParameters.to,
    }
  } else {
    return {
      ...base,
      __typename: NotificationEventType.SetUuidState,
      trashed: event.type === EventType.TrashUuid,
    }
  }
}

function toDatabaseRepresentation(
  event: PayloadForNewConcreteEvent,
): PayloadForNewAbstractEvent {
  const base = {
    ...R.pick(['actorId', 'instance'], event),
    uuidParameters: {},
    stringParameters: {},
  }

  if (event.__typename === NotificationEventType.SetThreadState) {
    return {
      ...base,
      type: event.archived ? EventType.ArchiveThread : EventType.RestoreThread,
      objectId: event.threadId,
    }
  } else if (event.__typename === NotificationEventType.CreateComment) {
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
      type: EventType.SetLicense,
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
  } else if (event.__typename === NotificationEventType.CreateEntityRevision) {
    return {
      ...base,
      type: EventType.CreateEntityRevision,
      objectId: event.entityRevisionId,
      uuidParameters: { repository: event.entityId },
    }
  } else if (
    event.__typename === NotificationEventType.CheckoutRevision ||
    event.__typename === NotificationEventType.RejectRevision
  ) {
    return {
      ...base,
      type:
        event.__typename === NotificationEventType.CheckoutRevision
          ? EventType.CheckoutRevision
          : EventType.RejectRevision,
      objectId: event.revisionId,
      uuidParameters: { repository: event.repositoryId },
      stringParameters: { reason: event.reason },
    }
  } else if (
    event.__typename === NotificationEventType.CreateTaxonomyLink ||
    event.__typename === NotificationEventType.RemoveTaxonomyLink
  ) {
    return {
      ...base,
      type:
        event.__typename === NotificationEventType.CreateTaxonomyLink
          ? EventType.CreateTaxonomyLink
          : EventType.RemoveTaxonomyLink,
      objectId: event.parentId,
      uuidParameters: { object: event.childId },
    }
  } else if (
    event.__typename === NotificationEventType.CreateTaxonomyTerm ||
    event.__typename === NotificationEventType.SetTaxonomyTerm
  ) {
    return {
      ...base,
      type:
        event.__typename === NotificationEventType.CreateTaxonomyTerm
          ? EventType.CreateTaxonomyTerm
          : EventType.SetTaxonomyTerm,
      objectId: event.taxonomyTermId,
    }
  } else if (event.__typename === NotificationEventType.SetTaxonomyParent) {
    return {
      ...base,
      type: EventType.SetTaxonomyParent,
      objectId: event.childId,
      uuidParameters: { from: event.previousParentId, to: event.parentId },
    }
  } else {
    return {
      ...base,
      type: event.trashed ? EventType.TrashUuid : EventType.RestoreUuid,
      objectId: event.objectId,
    }
  }
}

export async function createEvent(
  payload: PayloadForNewConcreteEvent,
  { database }: Pick<Context, 'database'>,
) {
  const abstractEventPayload = toDatabaseRepresentation(payload)
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
  event: Omit<DatabaseEventRepresentation, 'date'>,
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
