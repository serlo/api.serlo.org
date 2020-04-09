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
import { ApolloServer } from 'apollo-server'
import {
  ApolloServerTestClient,
  createTestClient as createApolloTestClient,
} from 'apollo-server-testing'

import { createInMemoryCache } from '../../src/cache/in-memory-cache'
import { getGraphQLOptions } from '../../src/graphql'
import { Cache } from '../../src/graphql/environment'

export type Client = ApolloServerTestClient
export function createTestClient(context: {}): {
  cache: Cache
  client: Client
} {
  const cache = createInMemoryCache()
  const server = new ApolloServer({
    ...getGraphQLOptions({
      cache,
    }),
    context() {
      return { ...context }
    },
  })
  return { cache, client: createApolloTestClient(server) }
}
