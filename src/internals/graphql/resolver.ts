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
import { GraphQLResolveInfo } from 'graphql'

import { Context } from './context'
import { Query } from '~/types'
import { AsyncOrSync } from '~/utils'

export type Resolver<P, A, T> = (
  parent: P,
  args: A,
  context: Context,
  info: GraphQLResolveInfo
) => AsyncOrSync<T>

export type QueryResolver<A, T> = Resolver<never, A, T>
export type MutationResolver<A, T> = Resolver<
  never,
  A,
  T extends { query: Query }
    ? Omit<T, 'query'> & { query: Record<string, never> }
    : T
>

export interface MutationResponse {
  success: boolean
  query: Record<string, never>
}
export interface MutationResponseWithRecord<R> extends MutationResponse {
  record: R
}

export type TypeResolver<T> = (type: T) => string

export type MutationNamespace = MutationResolver<never, Record<string, never>>
