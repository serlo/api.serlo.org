/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as R from 'ramda'

import {
  article,
  articleRevision,
  unsupportedComment,
  exercise,
  solution,
  taxonomyTermCurriculumTopic,
  taxonomyTermRoot,
  taxonomyTermSubject,
  unsupportedThread,
  user,
} from './uuid'
import { Model } from '~/internals/graphql'
import { CheckoutRevisionNotificationEventPayload } from '~/schema/notification/checkout-revision-notification-event/types'
import { CreateCommentNotificationEventPayload } from '~/schema/notification/create-comment-notification-event/types'
import { CreateEntityLinkNotificationEventPayload } from '~/schema/notification/create-entity-link-notification-event/types'
import { CreateEntityNotificationEventPayload } from '~/schema/notification/create-entity-notification-event/types'
import { CreateEntityRevisionNotificationEventPayload } from '~/schema/notification/create-entity-revision-notification-event/types'
import { CreateTaxonomyLinkNotificationEventPayload } from '~/schema/notification/create-taxonomy-link-notification-event/types'
import { CreateTaxonomyTermNotificationEventPayload } from '~/schema/notification/create-taxonomy-term-notification-event/types'
import { CreateThreadNotificationEventPayload } from '~/schema/notification/create-thread-notification-event/types'
import { RejectRevisionNotificationEventPayload } from '~/schema/notification/reject-revision-notification-event/types'
import { RemoveEntityLinkNotificationEventPayload } from '~/schema/notification/remove-entity-link-notification-event/types'
import { SetLicenseNotificationEventPayload } from '~/schema/notification/set-license-notification-event/types'
import { SetTaxonomyParentNotificationEventPayload } from '~/schema/notification/set-taxonomy-parent-notification-event/types'
import { SetTaxonomyTermNotificationEventPayload } from '~/schema/notification/set-taxonomy-term-notification-event/types'
import { SetUuidStateNotificationEventPayload } from '~/schema/notification/set-uuid-state-notification-event/types'
import { NotificationEventType } from '~/schema/notification/types'
import { Instance } from '~/types'

export const checkoutRevisionNotificationEvent: CheckoutRevisionNotificationEventPayload = {
  __typename: NotificationEventType.CheckoutRevision,
  id: 301,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  objectId: articleRevision.id,
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
  objectId: articleRevision.id,
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
  objectId: unsupportedComment.id,
  threadId: unsupportedThread.id,
  commentId: unsupportedComment.id,
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
  objectId: article.id,
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
  objectId: solution.id,
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
  objectId: solution.id,
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
  objectId: articleRevision.id,
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
  objectId: taxonomyTermCurriculumTopic.id,
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
  objectId: taxonomyTermCurriculumTopic.id,
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
  objectId: taxonomyTermCurriculumTopic.id,
  parentId: taxonomyTermCurriculumTopic.id,
  childId: article.id,
}

export function getCreateTaxonomyLinkNotificationEventDataWithoutSubResolvers(
  notificationEvent: CreateTaxonomyLinkNotificationEventPayload
) {
  return R.omit(['actorId', 'parentId', 'childId'], notificationEvent)
}

export const removeTaxonomyLinkNotificationEvent: Model<'RemoveTaxonomyLinkNotificationEvent'> = {
  __typename: NotificationEventType.RemoveTaxonomyLink,
  id: 48077,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  objectId: taxonomyTermCurriculumTopic.id,
  parentId: taxonomyTermCurriculumTopic.id,
  childId: article.id,
}

export function getRemoveTaxonomyLinkNotificationEventDataWithoutSubResolvers(
  notificationEvent: Model<'RemoveTaxonomyLinkNotificationEvent'>
) {
  return R.omit(['actorId', 'parentId', 'childId'], notificationEvent)
}

export const setTaxonomyParentNotificationEvent: SetTaxonomyParentNotificationEventPayload = {
  __typename: NotificationEventType.SetTaxonomyParent,
  id: 47414,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  objectId: taxonomyTermCurriculumTopic.id,
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
  threadId: unsupportedThread.id,
}

export function getCreateThreadNotificationEventDataWithoutSubResolvers(
  notificationEvent: CreateThreadNotificationEventPayload
) {
  return R.omit(['actorId', 'threadId'], notificationEvent)
}

export const setLicenseNotificationEvent: SetLicenseNotificationEventPayload = {
  __typename: NotificationEventType.SetLicense,
  id: 297,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  objectId: article.id,
  repositoryId: article.id,
}

export function getSetLicenseNotificationEventDataWithoutSubResolvers(
  notificationEvent: SetLicenseNotificationEventPayload
) {
  return R.omit(['actorId', 'repositoryId'], notificationEvent)
}

export const setThreadStateNotificationEvent: Model<'SetThreadStateNotificationEvent'> = {
  __typename: NotificationEventType.SetThreadState,
  id: 40750,
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: user.id,
  objectId: unsupportedThread.id,
  threadId: unsupportedThread.id,
  archived: true,
}

export function getSetThreadStateNotificationEventDataWithoutSubResolvers(
  notificationEvent: Model<'SetThreadStateNotificationEvent'>
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
  return R.omit(['actorId'], notificationEvent)
}
