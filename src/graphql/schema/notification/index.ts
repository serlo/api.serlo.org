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
import { Schema } from '../utils'
import { checkoutRevisionNotificationSchema } from './checkout-revision-notification-event'
import { createCommentNotificationEventSchema } from './create-comment-notification-event'
import { createEntityNotificationSchema } from './create-entity-notification-event'
import { createEntityRevisionNotificationSchema } from './create-entity-revision-notification-event'
import { createThreadNotificationEventSchema } from './create-thread-notification-event'
import { rejectRevisionNotificationSchema } from './reject-revision-notification-event'
import { resolvers } from './resolvers'
import { setThreadStateNotificationEventSchema } from './set-thread-state-notification-event'
import typeDefs from './types.graphql'

export * from './checkout-revision-notification-event'
export * from './create-comment-notification-event'
export * from './create-entity-notification-event'
export * from './create-entity-revision-notification-event'
export * from './create-thread-notification-event'
export * from './reject-revision-notification-event'
export * from './set-thread-state-notification-event'
export * from './types'

const baseSchema = new Schema(resolvers, [typeDefs])

export const notificationSchema = Schema.merge(
  baseSchema,
  checkoutRevisionNotificationSchema,
  createCommentNotificationEventSchema,
  createEntityNotificationSchema,
  createEntityRevisionNotificationSchema,
  createThreadNotificationEventSchema,
  rejectRevisionNotificationSchema,
  setThreadStateNotificationEventSchema
)
