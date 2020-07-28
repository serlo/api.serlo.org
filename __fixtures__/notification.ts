import * as R from 'ramda'

import {
  CreateCommentNotificationEventPayload,
  CreateEntityNotificationEventPayload,
  CreateThreadNotificationEventPayload,
  NotificationEventType,
  SetThreadStateNotificationEventPayload,
} from '../src/graphql/schema'
import { Instance } from '../src/types'
import { article, comment, thread, user } from './uuid'

export const createCommentNotificationEvent: CreateCommentNotificationEventPayload = {
  __typename: NotificationEventType.CreateComment,
  id: 37374,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  authorId: user.id,
  threadId: thread.id,
  commentId: comment.id,
}

export function getCreateCommentNotificationEventDataWithoutSubResolvers(
  notificationEvent: CreateCommentNotificationEventPayload
) {
  return R.omit(['authorId', 'threadId', 'commentId'], notificationEvent)
}

export const createEntityNotificationEvent: CreateEntityNotificationEventPayload = {
  __typename: NotificationEventType.CreateEntity,
  id: 298,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  authorId: user.id,
  entityId: article.id,
}

export function getCreateEntityNotificationEventDataWithoutSubResolvers(
  notificationEvent: CreateEntityNotificationEventPayload
) {
  return R.omit(['authorId', 'entityId'], notificationEvent)
}

export const createThreadNotificationEvent: CreateThreadNotificationEventPayload = {
  __typename: NotificationEventType.CreateThread,
  id: 37374,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  authorId: user.id,
  objectId: article.id,
  threadId: thread.id,
}

export function getCreateThreadNotificationEventDataWithoutSubResolvers(
  notificationEvent: CreateThreadNotificationEventPayload
) {
  return R.omit(['authorId', 'objectId', 'threadId'], notificationEvent)
}

export const setThreadStateNotificationEvent: SetThreadStateNotificationEventPayload = {
  __typename: NotificationEventType.SetThreadState,
  id: 40750,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  threadId: thread.id,
  archived: true,
}

export function getSetThreadStateNotificationEventDataWithoutSubResolvers(
  notificationEvent: SetThreadStateNotificationEventPayload
) {
  return R.omit(['actorId', 'threadId'], notificationEvent)
}
