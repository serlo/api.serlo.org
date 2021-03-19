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
import {
  Model,
  MutationNamespace,
  MutationResolver,
  QueryResolver,
  LegacyResolver,
  TypeResolver,
} from '~/internals/graphql'
import { Connection } from '~/schema/connection/types'
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
import { RemoveTaxonomyLinkNotificationEventPayload } from '~/schema/notification/remove-taxonomy-link-notification-event/types'
import { SetLicenseNotificationEventPayload } from '~/schema/notification/set-license-notification-event/types'
import { SetTaxonomyParentNotificationEventPayload } from '~/schema/notification/set-taxonomy-parent-notification-event/types'
import { SetTaxonomyTermNotificationEventPayload } from '~/schema/notification/set-taxonomy-term-notification-event/types'
import { SetThreadStateNotificationEventPayload } from '~/schema/notification/set-thread-state-notification-event/types'
import { SetUuidStateNotificationEventPayload } from '~/schema/notification/set-uuid-state-notification-event/types'
import {
  AbstractNotificationEvent,
  NotificationMutationSetStateArgs,
  Notification,
  QueryNotificationEventArgs,
  QueryNotificationsArgs,
  NotificationSetStateResponse,
} from '~/types'

export interface NotificationPayload
  extends Omit<
    Notification,
    keyof LegacyNotificationResolvers['Notification']
  > {
  eventId: number
}

export interface NotificationsPayload {
  notifications: NotificationPayload[]
  userId: number
}

export enum NotificationEventType {
  CheckoutRevision = 'CheckoutRevisionNotificationEvent',
  CreateComment = 'CreateCommentNotificationEvent',
  CreateEntity = 'CreateEntityNotificationEvent',
  CreateEntityRevision = 'CreateEntityRevisionNotificationEvent',
  CreateEntityLink = 'CreateEntityLinkNotificationEvent',
  CreateTaxonomyTerm = 'CreateTaxonomyTermNotificationEvent',
  CreateTaxonomyLink = 'CreateTaxonomyLinkNotificationEvent',
  CreateThread = 'CreateThreadNotificationEvent',
  RejectRevision = 'RejectRevisionNotificationEvent',
  RemoveEntityLink = 'RemoveEntityLinkNotificationEvent',
  RemoveTaxonomyLink = 'RemoveTaxonomyLinkNotificationEvent',
  SetLicense = 'SetLicenseNotificationEvent',
  SetTaxonomyTerm = 'SetTaxonomyTermNotificationEvent',
  SetTaxonomyParent = 'SetTaxonomyParentNotificationEvent',
  SetThreadState = 'SetThreadStateNotificationEvent',
  SetUuidState = 'SetUuidStateNotificationEvent',
}

export type NotificationEventPayload =
  | CheckoutRevisionNotificationEventPayload
  | RejectRevisionNotificationEventPayload
  | CreateEntityNotificationEventPayload
  | CreateEntityLinkNotificationEventPayload
  | RemoveEntityLinkNotificationEventPayload
  | CreateEntityRevisionNotificationEventPayload
  | CreateTaxonomyTermNotificationEventPayload
  | CreateTaxonomyLinkNotificationEventPayload
  | RemoveTaxonomyLinkNotificationEventPayload
  | CreateThreadNotificationEventPayload
  | CreateCommentNotificationEventPayload
  | SetLicenseNotificationEventPayload
  | SetTaxonomyParentNotificationEventPayload
  | SetTaxonomyTermNotificationEventPayload
  | SetThreadStateNotificationEventPayload
  | SetUuidStateNotificationEventPayload
export interface AbstractNotificationEventPayload
  extends Omit<AbstractNotificationEvent, 'actor'> {
  __typename: NotificationEventType
  actorId: number
  objectId: number
}

export interface LegacyNotificationResolvers {
  AbstractNotificationEvent: {
    __resolveType: TypeResolver<NotificationEventPayload>
  }
  Notification: {
    event: LegacyResolver<
      NotificationPayload,
      never,
      NotificationEventPayload | null
    >
  }
  Query: {
    notifications: QueryResolver<
      QueryNotificationsArgs,
      Connection<NotificationPayload>
    >
    notificationEvent: QueryResolver<
      QueryNotificationEventArgs,
      NotificationEventPayload | null
    >
  }
  Mutation: {
    notification: MutationNamespace
  }
  NotificationMutation: {
    setState: MutationResolver<
      NotificationMutationSetStateArgs,
      NotificationSetStateResponse
    >
  }
}

export interface NotificationEventResolvers<
  T extends AbstractNotificationEventPayload
> {
  actor: LegacyResolver<T, never, Partial<Model<'User'>> | null>
}
