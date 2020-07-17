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
  Mutation_SetNotificationEventArgs,
  Mutation_SetNotificationsArgs,
  MutationSetNotificationStateArgs,
  Notification,
  NotificationEvent,
  QueryNotificationsArgs,
} from '../../../types'
import { Connection } from '../connection'
import { MutationResolver, QueryResolver, Resolver } from '../types'
import { AbstractUuidPreResolver } from '../uuid/abstract-uuid'
import { UserPreResolver } from '../uuid/user'

export interface NotificationPreResolver
  extends Omit<Notification, keyof NotificationResolvers['Notification']> {
  eventId: number
}

export type NotificationPayload = NotificationPreResolver

export interface NotificationsPayload {
  notifications: NotificationPayload[]
  userId: number
}

export interface NotificationEventPreResolver
  extends Omit<
    NotificationEvent,
    keyof NotificationResolvers['NotificationEvent']
  > {
  actorId: number
  objectId: number
}

export type NotificationEventPayload = NotificationEventPreResolver

export interface NotificationResolvers {
  Notification: {
    event: Resolver<
      NotificationPreResolver,
      never,
      Partial<NotificationEventPreResolver>
    >
  }
  NotificationEvent: {
    actor: Resolver<
      NotificationEventPreResolver,
      never,
      Partial<UserPreResolver>
    >
    object: Resolver<
      NotificationEventPreResolver,
      never,
      AbstractUuidPreResolver
    >
  }
  Query: {
    notifications: QueryResolver<
      QueryNotificationsArgs,
      Connection<NotificationPreResolver>
    >
  }
  Mutation: {
    setNotificationState: MutationResolver<MutationSetNotificationStateArgs>
    _setNotifications: MutationResolver<Mutation_SetNotificationsArgs>
    _setNotificationEvent: MutationResolver<Mutation_SetNotificationEventArgs>
  }
}
