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
import { dateTimeSchema } from './date-time'
import { instanceSchema } from './instance'
import { licenseSchema } from './license'
import { Schema } from './utils'
import { uuidSchema } from './uuid'

export * from './date-time'
export * from './instance'
export * from './license'
export * from './uuid'

/**
 * Prototyping implementation of the setCache and removeCache
 * mutations. Not supposed to be at this file.
 * TODO: put into its own folder?
 */
import { gql } from 'apollo-server'

// See specification at issue #28
export const typeDefs = gql`
  extend type Mutation {
    _setCache(key: String!, value: String!): Boolean,
    _removeCache(key: String!, value: String!): Boolean
  }
`
// Mock resolvers for the *Cache mutations
export const resolvers = {
  Mutation: {
    _setCache: () =>  {
      return true
    },
    _removeCache: () =>  {
      return true
    }
  }
}

export const schema = Schema.merge(
  dateTimeSchema,
  instanceSchema,
  licenseSchema,
  uuidSchema, 
  new Schema( // TODO: get it imported from its own module
    (resolvers as unknown) as Schema['resolvers'],
    [typeDefs]
  )
)
