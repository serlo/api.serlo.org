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
import { checkoutRevisionNotificationEventSchema } from './checkout-revision-notification-event'
import { createCommentNotificationEventSchema } from './create-comment-notification-event'
import { createEntityLinkNotificationSchema } from './create-entity-link-notification-event'
import { createEntityNotificationEventSchema } from './create-entity-notification-event'
import { createEntityRevisionNotificationEventSchema } from './create-entity-revision-notification-event'
import { createTaxonomyLinkNotificationSchema } from './create-taxonomy-link-notification-event'
import { createTaxonomyTermNotificationEventSchema } from './create-taxonomy-term-notification-event'
import { createThreadNotificationEventSchema } from './create-thread-notification-event'
import { rejectRevisionNotificationEventSchema } from './reject-revision-notification-event'
import { removeEntityLinkNotificationSchema } from './remove-entity-link-notification-event'
import { removeTaxonomyLinkNotificationSchema } from './remove-taxonomy-link-notification-event'
import { resolvers } from './resolvers'
import { setLicenseNotificationEventSchema } from './set-license-notification-event'
import { setTaxonomyParentNotificationSchema } from './set-taxonomy-parent-notification-event'
import { setTaxonomyTermNotificationEventSchema } from './set-taxonomy-term-notification-event'
import { setThreadStateNotificationEventSchema } from './set-thread-state-notification-event'
import { setUuidStateNotificationEventSchema } from './set-uuid-state-notification-event'
import typeDefs from './types.graphql'
import { mergeSchemas, Schema } from '~/internals/graphql'

export * from './checkout-revision-notification-event'
export * from './create-comment-notification-event'
export * from './create-entity-notification-event'
export * from './create-entity-link-notification-event'
export * from './create-entity-revision-notification-event'
export * from './create-taxonomy-term-notification-event'
export * from './create-taxonomy-link-notification-event'
export * from './create-thread-notification-event'
export * from './reject-revision-notification-event'
export * from './remove-entity-link-notification-event'
export * from './remove-taxonomy-link-notification-event'
export * from './set-license-notification-event'
export * from './set-taxonomy-parent-notification-event'
export * from './set-taxonomy-term-notification-event'
export * from './set-thread-state-notification-event'
export * from './set-uuid-state-notification-event'
export * from './types'
export * from './utils'

const baseSchema: Schema = { resolvers, typeDefs: [typeDefs] }

export const notificationSchema = mergeSchemas(
  baseSchema,
  checkoutRevisionNotificationEventSchema,
  createCommentNotificationEventSchema,
  createEntityNotificationEventSchema,
  createEntityLinkNotificationSchema,
  createEntityRevisionNotificationEventSchema,
  createTaxonomyTermNotificationEventSchema,
  createTaxonomyLinkNotificationSchema,
  createThreadNotificationEventSchema,
  rejectRevisionNotificationEventSchema,
  removeEntityLinkNotificationSchema,
  removeTaxonomyLinkNotificationSchema,
  setLicenseNotificationEventSchema,
  setTaxonomyParentNotificationSchema,
  setTaxonomyTermNotificationEventSchema,
  setThreadStateNotificationEventSchema,
  setUuidStateNotificationEventSchema
)
