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
  CreateTaxonomyLinkNotificationEventPayload,
  CreateTaxonomyTermNotificationEventPayload,
  CreateThreadNotificationEventPayload,
  NotificationEventType,
  RejectRevisionNotificationEventPayload,
  RemoveEntityLinkNotificationEventPayload,
  RemoveTaxonomyLinkNotificationEventPayload,
  SetLicenseNotificationEventPayload,
  SetTaxonomyParentNotificationEventPayload,
  SetTaxonomyTermNotificationEventPayload,
  SetThreadStateNotificationEventPayload,
  SetUuidStateNotificationEventPayload,
} from '../src/graphql/schema'
import { Instance } from '../src/types'
import {
  article,
  articleRevision,
  comment,
  exercise,
  solution,
  taxonomyTermCurriculumTopic,
  taxonomyTermRoot,
  taxonomyTermSubject,
  thread,
  user,
} from './uuid'

export const checkoutRevisionNotificationEvent: CheckoutRevisionNotificationEventPayload = {
  __typename: NotificationEventType.CheckoutRevision,
  id: 301,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  repositoryId: article.id,
  revisionId: articleRevision.id,
  reason: 'reason',
}

export function getCheckoutRevisionNotificationEventDataWithoutSubResolvers(
  notificationEvent: CheckoutRevisionNotificationEventPayload
) {
  return R.omit(['actorId', 'repositoryId', 'revisionId'], notificationEvent)
}

export const rejectRevisionNotificationEvent: RejectRevisionNotificationEventPayload = {
  __typename: NotificationEventType.RejectRevision,
  id: 38035,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  repositoryId: article.id,
  revisionId: articleRevision.id,
  reason: 'reason',
}

export function getRejectRevisionNotificationEventDataWithoutSubResolvers(
  notificationEvent: RejectRevisionNotificationEventPayload
) {
  return R.omit(['actorId', 'repositoryId', 'revisionId'], notificationEvent)
}

export const createCommentNotificationEvent: CreateCommentNotificationEventPayload = {
  __typename: NotificationEventType.CreateComment,
  id: 37375,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  threadId: thread.id,
  commentId: comment.id,
}

export function getCreateCommentNotificationEventDataWithoutSubResolvers(
  notificationEvent: CreateCommentNotificationEventPayload
) {
  return R.omit(['actorId', 'threadId', 'commentId'], notificationEvent)
}

export const createEntityNotificationEvent: CreateEntityNotificationEventPayload = {
  __typename: NotificationEventType.CreateEntity,
  id: 298,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  entityId: article.id,
}

export function getCreateEntityNotificationEventDataWithoutSubResolvers(
  notificationEvent: CreateEntityNotificationEventPayload
) {
  return R.omit(['actorId', 'entityId'], notificationEvent)
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
  actorId: user.id,
  entityId: article.id,
  entityRevisionId: articleRevision.id,
}

export function getCreateEntityRevisionNotificationEventDataWithoutSubResolvers(
  notificationEvent: CreateEntityRevisionNotificationEventPayload
) {
  return R.omit(['actorId', 'entityId', 'entityRevisionId'], notificationEvent)
}

export const createTaxonomyTermNotificationEvent: CreateTaxonomyTermNotificationEventPayload = {
  __typename: NotificationEventType.CreateTaxonomyTerm,
  id: 90,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  taxonomyTermId: taxonomyTermCurriculumTopic.id,
}

export function getCreateTaxonomyTermNotificationEventDataWithoutSubResolvers(
  notificationEvent: CreateTaxonomyTermNotificationEventPayload
) {
  return R.omit(['actorId', 'taxonomyTermId'], notificationEvent)
}

export const setTaxonomyTermNotificationEvent: SetTaxonomyTermNotificationEventPayload = {
  __typename: NotificationEventType.SetTaxonomyTerm,
  id: 38405,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  taxonomyTermId: taxonomyTermCurriculumTopic.id,
}

export function getSetTaxonomyTermNotificationEventDataWithoutSubResolvers(
  notificationEvent: SetTaxonomyTermNotificationEventPayload
) {
  return R.omit(['actorId', 'taxonomyTermId'], notificationEvent)
}

export const createTaxonomyLinkNotificationEvent: CreateTaxonomyLinkNotificationEventPayload = {
  __typename: NotificationEventType.CreateTaxonomyLink,
  id: 674,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  parentId: taxonomyTermCurriculumTopic.id,
  childId: article.id,
}

export function getCreateTaxonomyLinkNotificationEventDataWithoutSubResolvers(
  notificationEvent: CreateTaxonomyLinkNotificationEventPayload
) {
  return R.omit(['actorId', 'parentId', 'childId'], notificationEvent)
}

export const removeTaxonomyLinkNotificationEvent: RemoveTaxonomyLinkNotificationEventPayload = {
  __typename: NotificationEventType.RemoveTaxonomyLink,
  id: 48077,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  parentId: taxonomyTermCurriculumTopic.id,
  childId: article.id,
}

export function getRemoveTaxonomyLinkNotificationEventDataWithoutSubResolvers(
  notificationEvent: RemoveTaxonomyLinkNotificationEventPayload
) {
  return R.omit(['actorId', 'parentId', 'childId'], notificationEvent)
}

export const setTaxonomyParentNotificationEvent: SetTaxonomyParentNotificationEventPayload = {
  __typename: NotificationEventType.SetTaxonomyParent,
  id: 47414,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  previousParentId: taxonomyTermRoot.id,
  parentId: taxonomyTermSubject.id,
  childId: taxonomyTermCurriculumTopic.id,
}

export function getSetTaxonomyParentNotificationEventDataWithoutSubResolvers(
  notificationEvent: SetTaxonomyParentNotificationEventPayload
) {
  return R.omit(
    ['actorId', 'previousParentId', 'parentId', 'childId'],
    notificationEvent
  )
}

export const createThreadNotificationEvent: CreateThreadNotificationEventPayload = {
  __typename: NotificationEventType.CreateThread,
  id: 37374,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  objectId: article.id,
  threadId: thread.id,
}

export function getCreateThreadNotificationEventDataWithoutSubResolvers(
  notificationEvent: CreateThreadNotificationEventPayload
) {
  return R.omit(['actorId', 'objectId', 'threadId'], notificationEvent)
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

export const setUuidStateNotificationEvent: SetUuidStateNotificationEventPayload = {
  __typename: NotificationEventType.SetUuidState,
  id: 38513,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  objectId: article.id,
  trashed: true,
}

export function getSetUuidStateNotificationEventDataWithoutSubResolvers(
  notificationEvent: SetUuidStateNotificationEventPayload
) {
  return R.omit(['actorId', 'objectId'], notificationEvent)
}
