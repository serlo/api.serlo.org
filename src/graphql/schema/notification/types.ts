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
import { Connection, ConnectionPayload } from '../../connection'
import { Instance } from '../instance'
import { MutationResolver, QueryResolver, Resolver } from '../types'
import { Uuid } from '../uuid/abstract-uuid'
import { User } from '../uuid/user'

export interface Notification {
  id: number
  unread: boolean
  eventId: number
}

export type NotificationPayload = Notification

export interface NotificationsPayload {
  notifications: NotificationPayload[]
  userId: number
}

export interface NotificationEvent {
  id: number
  type: string
  instance: Instance
  date: string
  actorId: number
  objectId: number
  payload: string
}

export type NotificationEventPayload = NotificationEvent

export interface SetNotificationStatePayload {
  id: number
  unread: boolean
}

export interface NotificationResolvers {
  Notification: {
    event: Resolver<Notification, never, Partial<NotificationEvent>>
  }
  NotificationEvent: {
    actor: Resolver<NotificationEvent, never, Partial<User>>
    object: Resolver<NotificationEvent, never, Uuid>
  }
  Query: {
    notifications: QueryResolver<ConnectionPayload, Connection<Notification>>
  }
  Mutation: {
    setNotificationState: MutationResolver<SetNotificationStatePayload>
    _setNotifications: MutationResolver<NotificationsPayload>
    _setNotificationEvent: MutationResolver<NotificationEventPayload>
  }
}
