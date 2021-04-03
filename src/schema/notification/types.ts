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

export type NotificationEventPayload = Model<'AbstractNotificationEvent'>

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
