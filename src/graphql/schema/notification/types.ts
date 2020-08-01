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
  QueryNotificationEventArgs,
} from '../../../types'
import { QueryResolver, TypeResolver } from '../types'
import { CheckoutRevisionNotificationEventPayload } from './checkout-revision-notification-event'
import { CreateCommentNotificationEventPayload } from './create-comment-notification-event'
import { CreateEntityLinkNotificationEventPayload } from './create-entity-link-notification-event'
import { CreateEntityNotificationEventPayload } from './create-entity-notification-event'
import { CreateEntityRevisionNotificationEventPayload } from './create-entity-revision-notification-event'
import { CreateThreadNotificationEventPayload } from './create-thread-notification-event'
import { RejectRevisionNotificationEventPayload } from './reject-revision-notification-event'
import { SetLicenseNotificationEventPayload } from './set-license-notification-event'
import { SetThreadStateNotificationEventPayload } from './set-thread-state-notification-event'

export enum NotificationEventType {
  CheckoutRevision = 'CheckoutRevisionNotificationEvent',
  CreateComment = 'CreateCommentNotificationEvent',
  CreateEntity = 'CreateEntityNotificationEvent',
  CreateEntityRevision = 'CreateEntityRevisionNotificationEvent',
  CreateEntityLink = 'CreateEntityLinkNotificationEvent',
  CreateThread = 'CreateThreadNotificationEvent',
  RejectRevision = 'RejectRevisionNotificationEvent',
  SetLicense = 'SetLicenseNotificationEvent',
  SetThreadState = 'SetThreadStateNotificationEvent',
}

export type NotificationEventPayload =
  | CheckoutRevisionNotificationEventPayload
  | CreateCommentNotificationEventPayload
  | CreateEntityNotificationEventPayload
  | CreateEntityLinkNotificationEventPayload
  | CreateEntityRevisionNotificationEventPayload
  | CreateThreadNotificationEventPayload
  | RejectRevisionNotificationEventPayload
  | SetLicenseNotificationEventPayload
  | SetThreadStateNotificationEventPayload
export interface AbstractNotificationEventPayload
  extends AbstractNotificationEvent {
  __typename: NotificationEventType
}

export interface NotificationResolvers {
  AbstractNotificationEvent: {
    __resolveType: TypeResolver<NotificationEventPayload>
  }
  Query: {
    notificationEvent: QueryResolver<
      QueryNotificationEventArgs,
      NotificationEventPayload
    >
  }
}
