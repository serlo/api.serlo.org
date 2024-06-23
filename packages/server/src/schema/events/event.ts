import * as t from 'io-ts'
import { date as DateDecoder } from 'io-ts-types'
import * as R from 'ramda'

import { Context } from '~/context'
import { Model } from '~/internals/graphql'
import { InstanceDecoder, NotificationEventType } from '~/model/decoder'

enum EventType {
  ArchiveThread = 'discussion/comment/archive',
  RestoreThread = 'discussion/restore',
  CreateComment = 'discussion/comment/create',
  CreateThread = 'discussion/create',
  CreateEntity = 'entity/create',
  SetLicense = 'license/object/set',
  CreateEntityLink = 'entity/link/create',
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
  payload: PayloadForNewEvent,
  { database }: Pick<Context, 'database'>,
) {
  const abstractEventPayload = toDatabaseRepresentation(payload)
  const { type, actorId, objectId, instance } = abstractEventPayload

  const transaction = await database.beginTransaction()

  try {
    const { insertId: eventId } = await database.mutate(
      `
      INSERT INTO event
          (actor_id, event_type_id, uuid_id, instance_id,
           uuid_parameter, uuid_parameter2, string_parameter)
        SELECT ?, event_type.id, ?, instance.id, ?, ?, ?
        FROM event_type, instance
        WHERE event_type.name = ? and instance.subdomain = ?
      `,
      [
        actorId,
        objectId,
        'uuidParameter' in abstractEventPayload
          ? abstractEventPayload.uuidParameter
          : null,
        'uuidParameter2' in abstractEventPayload
          ? abstractEventPayload.uuidParameter2
          : null,
        'stringParameter' in abstractEventPayload
          ? abstractEventPayload.stringParameter
          : null,
        type,
        instance,
      ],
    )

    const event = { ...abstractEventPayload, id: eventId }

    await createNotifications(event, { database })

    await transaction.commit()
  } finally {
    await transaction.rollback()
  }
}

async function createNotifications(
  event: Omit<DatabaseEventRepresentation, 'date'>,
  { database }: Pick<Context, 'database'>,
) {
  const { objectId, actorId } = event

  const objectIds = [
    objectId,
    ...('uuidParameter' in event ? [event.uuidParameter] : []),
    ...('uuidParameter2' in event ? [event.uuidParameter2] : []),
  ]
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
        INSERT INTO notification_event (notification_id, event_id)
          SELECT LAST_INSERT_ID(), ?
      `,
      [event.id],
    )
  }
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
      threadId: event.uuidParameter,
      commentId: event.objectId,
    }
  } else if (event.type === EventType.CreateThread) {
    return {
      ...base,
      __typename: NotificationEventType.CreateThread,
      objectId: event.uuidParameter,
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
    event.type === EventType.CreateEntityLink 
  ) {
    return {
      ...base,
      __typename: NotificationEventType.CreateEntityLink,
      childId: event.objectId,
      parentId: event.uuidParameter,
    }
  } else if (event.type === EventType.CreateEntityRevision) {
    return {
      ...base,
      __typename: NotificationEventType.CreateEntityRevision,
      entityId: event.uuidParameter,
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
      repositoryId: event.uuidParameter,
      revisionId: event.objectId,
      reason: event.stringParameter,
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
      childId: event.uuidParameter,
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
      previousParentId: event.uuidParameter,
      parentId: event.uuidParameter2,
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
  event: PayloadForNewEvent,
): PayloadForNewAbstractEvent {
  const base = R.pick(['actorId', 'instance'], event)

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
      uuidParameter: event.threadId,
    }
  } else if (event.__typename === NotificationEventType.CreateThread) {
    return {
      ...base,
      type: EventType.CreateThread,
      objectId: event.threadId,
      uuidParameter: event.objectId,
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
    event.__typename === NotificationEventType.CreateEntityLink 
  ) {
    return {
      ...base,
      type: EventType.CreateEntityLink,
      objectId: event.childId,
      uuidParameter: event.parentId,
    }
  } else if (event.__typename === NotificationEventType.CreateEntityRevision) {
    return {
      ...base,
      type: EventType.CreateEntityRevision,
      objectId: event.entityRevisionId,
      uuidParameter: event.entityId,
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
      uuidParameter: event.repositoryId,
      stringParameter: event.reason,
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
      uuidParameter: event.childId,
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
      uuidParameter: event.previousParentId,
      uuidParameter2: event.parentId,
    }
  } else {
    return {
      ...base,
      type: event.trashed ? EventType.TrashUuid : EventType.RestoreUuid,
      objectId: event.objectId,
    }
  }
}

export type DatabaseEventRepresentation = {
  [P in keyof typeof DatabaseEventRepresentations]: t.TypeOf<
    (typeof DatabaseEventRepresentations)[P]
  >
}[keyof typeof DatabaseEventRepresentations]

type PayloadForNewAbstractEvent = {
  [P in keyof typeof DatabaseEventRepresentations]: Omit<
    t.TypeOf<(typeof DatabaseEventRepresentations)[P]>,
    'id' | 'date'
  >
}[keyof typeof DatabaseEventRepresentations]

type GraphQLEventModels =
  | Model<'SetThreadStateNotificationEvent'>
  | Model<'CreateCommentNotificationEvent'>
  | Model<'CreateThreadNotificationEvent'>
  | Model<'CreateEntityNotificationEvent'>
  | Model<'SetLicenseNotificationEvent'>
  | Model<'CreateEntityLinkNotificationEvent'>
  | Model<'CreateEntityRevisionNotificationEvent'>
  | Model<'CheckoutRevisionNotificationEvent'>
  | Model<'RejectRevisionNotificationEvent'>
  | Model<'CreateTaxonomyLinkNotificationEvent'>
  | Model<'RemoveTaxonomyLinkNotificationEvent'>
  | Model<'CreateTaxonomyTermNotificationEvent'>
  | Model<'SetTaxonomyTermNotificationEvent'>
  | Model<'SetTaxonomyParentNotificationEvent'>
  | Model<'SetUuidStateNotificationEvent'>

type PayloadForNewEvent =
  | Omit<Model<'SetThreadStateNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<Model<'CreateCommentNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<Model<'CreateThreadNotificationEvent'>, 'id' | 'date'>
  | Omit<Model<'CreateEntityNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<Model<'SetLicenseNotificationEvent'>, 'id' | 'date' | 'objectId'>
  | Omit<Model<'CreateEntityLinkNotificationEvent'>, 'id' | 'date' | 'objectId'>
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

const DatabaseEventRepresentations = {
  ArchiveThread: getDatabaseRepresentationDecoder({
    type: EventType.ArchiveThread,
    parameters: t.type({}),
  }),
  RestoreThread: getDatabaseRepresentationDecoder({
    type: EventType.RestoreThread,
    parameters: t.type({}),
  }),
  CreateComment: getDatabaseRepresentationDecoder({
    type: EventType.CreateComment,
    parameters: t.type({ uuidParameter: t.number }),
  }),
  CreateThread: getDatabaseRepresentationDecoder({
    type: EventType.CreateThread,
    parameters: t.type({ uuidParameter: t.number }),
  }),
  CreateEntity: getDatabaseRepresentationDecoder({
    type: EventType.CreateEntity,
    parameters: t.type({}),
  }),
  SetLicense: getDatabaseRepresentationDecoder({
    type: EventType.SetLicense,
    parameters: t.type({}),
  }),
  CreateEntityLink: getDatabaseRepresentationDecoder({
    type: EventType.CreateEntityLink,
    parameters: t.type({ uuidParameter: t.number }),
  }),
  CreateEntityRevision: getDatabaseRepresentationDecoder({
    type: EventType.CreateEntityRevision,
    parameters: t.type({ uuidParameter: t.number }),
  }),
  CheckoutRevision: getDatabaseRepresentationDecoder({
    type: EventType.CheckoutRevision,
    parameters: t.type({ uuidParameter: t.number, stringParameter: t.string }),
  }),
  RejectRevision: getDatabaseRepresentationDecoder({
    type: EventType.RejectRevision,
    parameters: t.type({ uuidParameter: t.number, stringParameter: t.string }),
  }),
  CreateTaxonomyLink: getDatabaseRepresentationDecoder({
    type: EventType.CreateTaxonomyLink,
    parameters: t.type({ uuidParameter: t.number }),
  }),
  RemoveTaxonomyLink: getDatabaseRepresentationDecoder({
    type: EventType.RemoveTaxonomyLink,
    parameters: t.type({ uuidParameter: t.number }),
  }),
  CreateTaxonomyTerm: getDatabaseRepresentationDecoder({
    type: EventType.CreateTaxonomyTerm,
    parameters: t.type({}),
  }),
  SetTaxonomyTerm: getDatabaseRepresentationDecoder({
    type: EventType.SetTaxonomyTerm,
    parameters: t.type({}),
  }),
  SetTaxonomyParent: getDatabaseRepresentationDecoder({
    type: EventType.SetTaxonomyParent,
    parameters: t.type({
      uuidParameter: t.union([t.number, t.null]),
      uuidParameter2: t.union([t.number, t.null]),
    }),
  }),
  TrashUuid: getDatabaseRepresentationDecoder({
    type: EventType.TrashUuid,
    parameters: t.type({}),
  }),
  RestoreUuid: getDatabaseRepresentationDecoder({
    type: EventType.RestoreUuid,
    parameters: t.type({}),
  }),
} as const

export const DatabaseEventRepresentation: t.Type<DatabaseEventRepresentation> =
  t.union([
    DatabaseEventRepresentations.ArchiveThread,
    DatabaseEventRepresentations.CheckoutRevision,
    DatabaseEventRepresentations.CreateComment,
    DatabaseEventRepresentations.CreateEntity,
    DatabaseEventRepresentations.CreateEntityLink,
    DatabaseEventRepresentations.CreateEntityRevision,
    DatabaseEventRepresentations.CreateTaxonomyTerm,
    DatabaseEventRepresentations.CreateTaxonomyLink,
    DatabaseEventRepresentations.CreateThread,
    DatabaseEventRepresentations.RejectRevision,
    DatabaseEventRepresentations.RemoveTaxonomyLink,
    DatabaseEventRepresentations.RestoreThread,
    DatabaseEventRepresentations.RestoreUuid,
    DatabaseEventRepresentations.SetLicense,
    DatabaseEventRepresentations.SetTaxonomyParent,
    DatabaseEventRepresentations.SetTaxonomyTerm,
    DatabaseEventRepresentations.TrashUuid,
  ])

function getDatabaseRepresentationDecoder<
  Type extends EventType,
  Parameters extends {
    uuidParameter?: number | null
    uuidParameter2?: number | null
    stringParameter?: string
  },
>({ type, parameters }: { type: Type; parameters: t.Type<Parameters> }) {
  return t.intersection([
    t.type({
      id: t.number,
      type: t.literal(type),
      actorId: t.number,
      date: DateDecoder,
      objectId: t.number,
      instance: InstanceDecoder,
    }),
    parameters,
  ])
}
