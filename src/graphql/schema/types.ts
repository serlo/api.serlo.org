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
import { GraphQLResolveInfo } from 'graphql'

import { DataSources } from '../data-sources'

export type Resolver<P, A, T> = (
  parent: P,
  args: A,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<T | void>

export type QueryResolver<A, T> = Resolver<never, A, T>
export type MutationResolver<A, T = null> = Resolver<never, A, T>
export type TypeResolver<T> = (type: T) => string

export enum Service {
  Playground = 'api.serlo.org-playground',
  Serlo = 'serlo.org',
  SerloCloudflareWorker = 'serlo.org-cloudflare-worker',
}

export interface Context {
  dataSources: DataSources
  service: Service
  user: number | null
}
