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
import { CreateEntityNotificationEvent } from '../../../../types'
import { Resolver } from '../../types'
import { EntityPreResolver } from '../../uuid/abstract-entity'
import { UserPreResolver } from '../../uuid/user'
import { NotificationEventType } from '../types'

export interface CreateEntityNotificationEventPreResolver
  extends Omit<
    CreateEntityNotificationEvent,
    keyof CreateEntityNotificationEventResolvers['CreateEntityNotificationEvent']
  > {
  __typename: NotificationEventType.CreateEntity
  authorId: number
  entityId: number
}

export type CreateEntityNotificationEventPayload = CreateEntityNotificationEventPreResolver

export interface CreateEntityNotificationEventResolvers {
  CreateEntityNotificationEvent: {
    author: Resolver<
      CreateEntityNotificationEventPreResolver,
      never,
      Partial<UserPreResolver>
    >
    entity: Resolver<
      CreateEntityNotificationEventPreResolver,
      never,
      EntityPreResolver
    >
  }
}
