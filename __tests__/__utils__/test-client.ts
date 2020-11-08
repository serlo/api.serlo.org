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

import { createInMemoryCache } from '../../src/cache'
import { getGraphQLOptions } from '../../src/graphql'
import { Cache, createTimer, Timer } from '../../src/graphql/environment'
import { Context, Service } from '../../src/graphql/schema/types'

export type Client = ApolloServerTestClient

export function createTestClient(
  args?: Partial<Pick<Context, 'service' | 'user'>> & { timer?: Timer }
): {
  client: Client
  cache: Cache
} {
  const cache = createInMemoryCache()
  const server = new ApolloServer({
    ...getGraphQLOptions({ cache, timer: args?.timer ?? createTimer() }),
    context(): Pick<Context, 'service' | 'user'> {
      return {
        service: args?.service ?? Service.SerloCloudflareWorker,
        user: args?.user ?? null,
      }
    },
  })
  return { client: createApolloTestClient(server), cache }
}
