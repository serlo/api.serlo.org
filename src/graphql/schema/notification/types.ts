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
import {
  AbstractNotificationEvent,
  MutationSetNotificationStateArgs,
  Notification,
  QueryNotificationEventArgs,
  QueryNotificationsArgs,
  QueryEventsArgs,
} from '../../../types'
import { Connection } from '../connection'
import {
  MutationResolver,
  QueryResolver,
  Resolver,
  TypeResolver,
} from '../types'
import { UserPayload } from '../uuid/user'
import { CheckoutRevisionNotificationEventPayload } from './checkout-revision-notification-event'
import { CreateCommentNotificationEventPayload } from './create-comment-notification-event'
import { CreateEntityLinkNotificationEventPayload } from './create-entity-link-notification-event'
import { CreateEntityNotificationEventPayload } from './create-entity-notification-event'
import { CreateEntityRevisionNotificationEventPayload } from './create-entity-revision-notification-event'
import { CreateTaxonomyLinkNotificationEventPayload } from './create-taxonomy-link-notification-event'
import { CreateTaxonomyTermNotificationEventPayload } from './create-taxonomy-term-notification-event'
import { CreateThreadNotificationEventPayload } from './create-thread-notification-event'
import { RejectRevisionNotificationEventPayload } from './reject-revision-notification-event'
import { RemoveEntityLinkNotificationEventPayload } from './remove-entity-link-notification-event'
import { RemoveTaxonomyLinkNotificationEventPayload } from './remove-taxonomy-link-notification-event'
import { SetLicenseNotificationEventPayload } from './set-license-notification-event'
import { SetTaxonomyParentNotificationEventPayload } from './set-taxonomy-parent-notification-event'
import { SetTaxonomyTermNotificationEventPayload } from './set-taxonomy-term-notification-event'
import { SetThreadStateNotificationEventPayload } from './set-thread-state-notification-event'
import { SetUuidStateNotificationEventPayload } from './set-uuid-state-notification-event'

export interface NotificationPayload
  extends Omit<Notification, keyof NotificationResolvers['Notification']> {
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
}

export interface NotificationResolvers {
  AbstractNotificationEvent: {
    __resolveType: TypeResolver<NotificationEventPayload>
  }
  Notification: {
    event: Resolver<NotificationPayload, never, NotificationEventPayload | null>
  }
  Query: {
    events: QueryResolver<
      QueryEventsArgs,
      Connection<AbstractNotificationEventPayload>
    >
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
    setNotificationState: MutationResolver<MutationSetNotificationStateArgs>
  }
}

export interface NotificationEventResolvers<
  T extends AbstractNotificationEventPayload
> {
  actor: Resolver<T, never, Partial<UserPayload> | null>
}
