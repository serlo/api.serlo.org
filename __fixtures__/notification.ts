import * as R from 'ramda'

import {
  CreateCommentNotificationEventPayload,
  CreateThreadNotificationEventPayload,
  NotificationEventType,
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
