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
  MutationSetLegacyNotificationStateArgs,
  LegacyNotification,
  LegacyNotificationEvent,
  QueryLegacyNotificationsArgs,
} from '../../../types'
import { Connection } from '../connection'
import { MutationResolver, QueryResolver, Resolver } from '../types'
import { AbstractUuidPayload } from '../uuid/abstract-uuid'
import { UserPayload } from '../uuid/user'

export interface LegacyNotificationPayload
  extends Omit<
    LegacyNotification,
    keyof LegacyNotificationResolvers['LegacyNotification']
  > {
  eventId: number
}

export interface LegacyNotificationsPayload {
  notifications: LegacyNotificationPayload[]
  userId: number
}

export interface LegacyNotificationEventPayload
  extends Omit<
    LegacyNotificationEvent,
    keyof LegacyNotificationResolvers['LegacyNotificationEvent']
  > {
  actorId: number
  objectId: number
}

export interface LegacyNotificationResolvers {
  LegacyNotification: {
    event: Resolver<
      LegacyNotificationPayload,
      never,
      Partial<LegacyNotificationEventPayload>
    >
  }
  LegacyNotificationEvent: {
    actor: Resolver<LegacyNotificationEventPayload, never, Partial<UserPayload>>
    object: Resolver<LegacyNotificationEventPayload, never, AbstractUuidPayload>
  }
  Query: {
    legacyNotifications: QueryResolver<
      QueryLegacyNotificationsArgs,
      Connection<LegacyNotificationPayload>
    >
  }
  Mutation: {
    setLegacyNotificationState: MutationResolver<
      MutationSetLegacyNotificationStateArgs
    >
  }
}
