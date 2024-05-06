import { option as O, function as F } from 'fp-ts'
import * as t from 'io-ts'

import {
  CommentDecoder,
  EntityDecoder,
  EntityRevisionTypeDecoder,
  EntityTypeDecoder,
  InstanceDecoder,
  NotificationEventDecoder,
  PageDecoder,
  SubscriptionsDecoder,
  UuidDecoder,
} from './decoder'
import { UserInputError } from '~/errors'

export const spec = {
  ActiveReviewersQuery: {
    payload: t.undefined,
    response: t.array(t.number),
    canBeNull: false,
  },
  ActivityByTypeQuery: {
    payload: t.type({ userId: t.number }),
    response: t.type({
      edits: t.number,
      comments: t.number,
      reviews: t.number,
      taxonomy: t.number,
    }),
    canBeNull: false,
  },
  AliasQuery: {
    payload: t.type({ path: t.string, instance: InstanceDecoder }),
    response: t.type({
      id: t.number,
      instance: InstanceDecoder,
      path: t.string,
    }),
    canBeNull: true,
  },
  DeletedEntitiesQuery: {
    payload: t.type({
      first: t.number,
      after: t.union([t.string, t.undefined]),
      instance: t.union([InstanceDecoder, t.undefined]),
    }),
    response: t.type({
      deletedEntities: t.array(
        t.type({
          id: t.number,
          dateOfDeletion: t.string,
        }),
      ),
    }),
    canBeNull: false,
  },
  EntityAddRevisionMutation: {
    payload: t.type({
      userId: t.number,
      revisionType: EntityRevisionTypeDecoder,
      input: t.type({
        changes: t.string,
        entityId: t.number,
        needsReview: t.boolean,
        subscribeThis: t.boolean,
        subscribeThisByEmail: t.boolean,
        fields: t.record(t.string, t.union([t.string, t.undefined])),
      }),
    }),
    response: t.type({
      success: t.literal(true),
      revisionId: t.number,
    }),
    canBeNull: false,
  },
  EntityCheckoutRevisionMutation: {
    payload: t.type({
      revisionId: t.number,
      userId: t.number,
      reason: t.string,
    }),
    response: t.type({ success: t.literal(true) }),
    canBeNull: false,
  },
  EntityRejectRevisionMutation: {
    payload: t.type({
      revisionId: t.number,
      userId: t.number,
      reason: t.string,
    }),
    response: t.type({ success: t.literal(true) }),
    canBeNull: false,
  },
  EntityCreateMutation: {
    payload: t.type({
      userId: t.number,
      entityType: EntityTypeDecoder,
      input: t.intersection([
        t.type({
          changes: t.string,
          licenseId: t.number,
          needsReview: t.boolean,
          subscribeThis: t.boolean,
          subscribeThisByEmail: t.boolean,
          fields: t.record(t.string, t.string),
        }),
        // TODO: prefer union
        t.partial({
          parentId: t.number,
          taxonomyTermId: t.number,
        }),
      ]),
    }),
    response: EntityDecoder,
    canBeNull: false,
  },
  EntitySortMutation: {
    payload: t.type({ childrenIds: t.array(t.number), entityId: t.number }),
    response: t.type({ success: t.boolean }),
    canBeNull: false,
  },
  EventQuery: {
    payload: t.type({ id: t.number }),
    response: NotificationEventDecoder,
    canBeNull: true,
  },
  PageAddRevisionMutation: {
    payload: t.type({
      content: t.string,
      pageId: t.number,
      title: t.string,
      userId: t.number,
    }),
    response: t.type({
      success: t.boolean,
      revisionId: t.union([t.number, t.null]),
    }),
    canBeNull: false,
  },
  PageCheckoutRevisionMutation: {
    payload: t.type({
      revisionId: t.number,
      userId: t.number,
      reason: t.string,
    }),
    response: t.type({ success: t.literal(true) }),
    canBeNull: false,
  },
  PageCreateMutation: {
    payload: t.intersection([
      t.type({
        content: t.string,
        discussionsEnabled: t.boolean,
        instance: InstanceDecoder,
        licenseId: t.number,
        title: t.string,
        userId: t.number,
      }),
      t.partial({
        forumId: t.union([t.number, t.null]),
      }),
    ]),
    response: t.union([PageDecoder, t.undefined]),
    canBeNull: false,
  },
  PagesQuery: {
    payload: t.type({
      instance: t.union([InstanceDecoder, t.undefined]),
    }),
    response: t.type({
      pages: t.array(t.number),
    }),
    canBeNull: false,
  },
  EntitySetLicenseMutation: {
    payload: t.type({
      entityId: t.number,
      licenseId: t.number,
      userId: t.number,
    }),
    response: t.type({ success: t.literal(true) }),
    canBeNull: false,
  },
  SubscriptionsQuery: {
    payload: t.type({ userId: t.number }),
    response: SubscriptionsDecoder,
    canBeNull: false,
  },
  SubscriptionSetMutation: {
    payload: t.type({
      ids: t.array(t.number),
      userId: t.number,
      subscribe: t.boolean,
      sendEmail: t.boolean,
    }),
    response: t.void,
    canBeNull: false,
  },
  ThreadCreateCommentMutation: {
    payload: t.type({
      content: t.string,
      threadId: t.number,
      userId: t.number,
      subscribe: t.boolean,
      sendEmail: t.boolean,
    }),
    response: t.union([CommentDecoder, t.null]),
    canBeNull: false,
  },
  ThreadCreateThreadMutation: {
    payload: t.type({
      content: t.string,
      objectId: t.number,
      sendEmail: t.boolean,
      subscribe: t.boolean,
      title: t.string,
      userId: t.number,
    }),
    // TODO: See whether it can be just CommentDecoder
    response: t.union([CommentDecoder, t.null]),
    canBeNull: false,
  },
  ThreadSetThreadArchivedMutation: {
    payload: t.type({
      ids: t.array(t.number),
      archived: t.boolean,
      userId: t.number,
    }),
    response: t.void,
    canBeNull: false,
  },
  ThreadsQuery: {
    payload: t.type({ id: t.number }),
    response: t.type({ firstCommentIds: t.array(t.number) }),
    canBeNull: false,
  },
  UnrevisedEntitiesQuery: {
    payload: t.type({}),
    response: t.strict({ unrevisedEntityIds: t.array(t.number) }),
    canBeNull: false,
  },
  UserCreateMutation: {
    payload: t.type({
      username: t.string,
      password: t.string,
      email: t.string,
    }),
    response: t.strict({
      success: t.literal(true),
      userId: t.number,
    }),
    canBeNull: false,
  },
  UserAddRoleMutation: {
    payload: t.type({ username: t.string, roleName: t.string }),
    response: t.strict({
      success: t.literal(true),
    }),
    canBeNull: false,
  },
  UsersByRoleQuery: {
    payload: t.type({
      roleName: t.string,
      first: t.number,
      after: t.union([t.number, t.undefined]),
    }),
    response: t.strict({
      usersByRole: t.array(t.number),
    }),
    canBeNull: false,
  },
  UserDeleteBotsMutation: {
    payload: t.type({ botIds: t.array(t.number) }),
    response: t.strict({
      success: t.literal(true),
      emailHashes: t.array(t.string),
    }),
    canBeNull: false,
  },
  UserDeleteRegularUsersMutation: {
    payload: t.type({ userId: t.number }),
    response: t.union([
      t.type({ success: t.literal(true) }),
      t.type({ success: t.literal(false), reason: t.string }),
    ]),
    canBeNull: false,
  },
  UserPotentialSpamUsersQuery: {
    payload: t.type({ first: t.number, after: t.union([t.number, t.null]) }),
    response: t.type({ userIds: t.array(t.number) }),
    canBeNull: false,
  },
  UserRemoveRoleMutation: {
    payload: t.type({ username: t.string, roleName: t.string }),
    response: t.strict({
      success: t.literal(true),
    }),
    canBeNull: false,
  },
  UserSetEmailMutation: {
    payload: t.type({ userId: t.number, email: t.string }),
    response: t.type({ success: t.boolean, username: t.string }),
    canBeNull: false,
  },
  UuidQuery: {
    payload: t.type({ id: t.number }),
    response: UuidDecoder,
    canBeNull: true,
  },
} as const

export async function makeRequest<M extends MessageType>(
  type: M,
  payload: Payload<M>,
) {
  const databaseLayerUrl = `http://${process.env.SERLO_ORG_DATABASE_LAYER_HOST}`
  const body = JSON.stringify({
    type,
    ...(payload === undefined ? {} : { payload }),
  })
  const response = await fetch(databaseLayerUrl, {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json' },
  })

  if (response.status === 200) {
    if (spec[type].response._tag === 'VoidType') return

    return await response.json()
  } else if (response.status === 404 && spec[type].canBeNull) {
    // TODO: Here we can check whether the body is "null" and report it to
    // Sentry
    return null
  } else if (response.status === 400) {
    const responseText = await response.text()
    const reason = F.pipe(
      O.tryCatch(() => JSON.parse(responseText) as unknown),
      O.chain(O.fromPredicate(t.type({ reason: t.string }).is)),
      O.map((json) => json.reason),
      O.getOrElse(() => 'Bad Request'),
    )

    throw new UserInputError(reason)
  } else {
    throw new Error(`${response.status}: ${body}`)
  }
}

export function getDecoderFor<M extends NullableMessageType>(
  message: M,
): t.UnionC<[ResponseDecoder<M>, t.NullC]>
export function getDecoderFor<M extends NotNullableMessageType>(
  message: M,
): ResponseDecoder<M>
export function getDecoderFor<M extends MessageType>(message: M): t.Mixed {
  const messageSpec = spec[message]

  return messageSpec.canBeNull
    ? t.union([messageSpec.response, t.null])
    : messageSpec.response
}

export function getPayloadDecoderFor<M extends MessageType>(
  message: M,
): PayloadDecoder<M> {
  return spec[message]['payload']
}

export type Spec = typeof spec
export type MessageType = keyof Spec
export type NullableMessageType = {
  [K in MessageType]: Spec[K]['canBeNull'] extends true ? K : never
}[MessageType]
export type NotNullableMessageType = {
  [K in MessageType]: Spec[K]['canBeNull'] extends false ? K : never
}[MessageType]
export type Payload<M extends MessageType> = t.TypeOf<Spec[M]['payload']>
export type Response<M extends MessageType> = t.TypeOf<Spec[M]['response']>
export type PayloadDecoder<M extends MessageType> = Spec[M]['payload']
export type ResponseDecoder<M extends MessageType> = Spec[M]['response']
