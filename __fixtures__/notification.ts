/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as R from 'ramda'

import {
  CheckoutRevisionNotificationEventPayload,
  CreateCommentNotificationEventPayload,
  CreateEntityLinkNotificationEventPayload,
  CreateEntityNotificationEventPayload,
  CreateEntityRevisionNotificationEventPayload,
  CreateThreadNotificationEventPayload,
  NotificationEventType,
  RejectRevisionNotificationEventPayload,
  RemoveEntityLinkNotificationEventPayload,
  SetLicenseNotificationEventPayload,
  SetThreadStateNotificationEventPayload,
} from '../src/graphql/schema'
import { Instance } from '../src/types'
import {
  article,
  articleRevision,
  comment,
  exercise,
  solution,
  thread,
  user,
} from './uuid'

export const checkoutRevisionNotificationEvent: CheckoutRevisionNotificationEventPayload = {
  __typename: NotificationEventType.CheckoutRevision,
  id: 301,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  reviewerId: user.id,
  repositoryId: article.id,
  revisionId: articleRevision.id,
  reason: 'reason',
}

export function getCheckoutRevisionNotificationEventDataWithoutSubResolvers(
  notificationEvent: CheckoutRevisionNotificationEventPayload
) {
  return R.omit(['reviewerId', 'repositoryId', 'revisionId'], notificationEvent)
}

export const rejectRevisionNotificationEvent: RejectRevisionNotificationEventPayload = {
  __typename: NotificationEventType.RejectRevision,
  id: 301,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  reviewerId: user.id,
  repositoryId: article.id,
  revisionId: articleRevision.id,
  reason: 'reason',
}

export function getRejectRevisionNotificationEventDataWithoutSubResolvers(
  notificationEvent: RejectRevisionNotificationEventPayload
) {
  return R.omit(['reviewerId', 'repositoryId', 'revisionId'], notificationEvent)
}

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

export const createEntityLinkNotificationEvent: CreateEntityLinkNotificationEventPayload = {
  __typename: NotificationEventType.CreateEntityLink,
  id: 2115,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  parentId: exercise.id,
  childId: solution.id,
}

export function getCreateEntityLinkNotificationEventDataWithoutSubResolvers(
  notificationEvent: CreateEntityLinkNotificationEventPayload
) {
  return R.omit(['actorId', 'parentId', 'childId'], notificationEvent)
}

export const removeEntityLinkNotificationEvent: RemoveEntityLinkNotificationEventPayload = {
  __typename: NotificationEventType.RemoveEntityLink,
  id: 55273,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  parentId: exercise.id,
  childId: solution.id,
}

export function getRemoveEntityLinkNotificationEventDataWithoutSubResolvers(
  notificationEvent: RemoveEntityLinkNotificationEventPayload
) {
  return R.omit(['actorId', 'parentId', 'childId'], notificationEvent)
}

export const createEntityRevisionNotificationEvent: CreateEntityRevisionNotificationEventPayload = {
  __typename: NotificationEventType.CreateEntityRevision,
  id: 300,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  authorId: user.id,
  entityId: article.id,
  entityRevisionId: articleRevision.id,
}

export function getCreateEntityRevisionNotificationEventDataWithoutSubResolvers(
  notificationEvent: CreateEntityRevisionNotificationEventPayload
) {
  return R.omit(['authorId', 'entityId', 'entityRevisionId'], notificationEvent)
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

export const setLicenseNotificationEvent: SetLicenseNotificationEventPayload = {
  __typename: NotificationEventType.SetLicense,
  id: 297,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  repositoryId: article.id,
}

export function getSetLicenseNotificationEventDataWithoutSubResolvers(
  notificationEvent: SetLicenseNotificationEventPayload
) {
  return R.omit(['actorId', 'repositoryId'], notificationEvent)
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
