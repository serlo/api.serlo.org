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
import { mergeSchemas } from '../internals/graphql'
import { cacheSchema } from './cache'
import { connectionSchema } from './connection'
import { dateTimeSchema } from './date-time'
import { instanceSchema } from './instance'
import { jsonSchema } from './json'
import { licenseSchema } from './license'
import { notificationSchema } from './notification'
import { subscriptionSchema } from './subscription'
import { uuidSchema } from './uuid'

export * from './connection'
export * from './date-time'
export * from './instance'
export * from './json'
export * from './license'
export * from './notification'
export * from './subscription'
export * from './uuid'

export const schema = mergeSchemas(
  connectionSchema,
  cacheSchema,
  dateTimeSchema,
  instanceSchema,
  jsonSchema,
  licenseSchema,
  notificationSchema,
  uuidSchema,
  subscriptionSchema
)
