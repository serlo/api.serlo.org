/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import dotenv from 'dotenv'
import createApp from 'express'
import path from 'path'

import { applyGraphQLMiddleware } from './graphql-middleware'
import { applySwrQueueDashboardMiddleware } from './swr-queue-dashboard-middleware'
import { createAuthServices, AuthServices } from '../authentication'
import { Cache, createCache, createEmptyCache } from '../cache'
import { initializeSentry } from '../sentry'
import { createSwrQueue, SwrQueue } from '../swr-queue'
import { createTimer } from '../timer'
import { applyKratosMiddleware } from '~/internals/server/kratos-middleware'

export * from './graphql-middleware'
export * from './swr-queue-dashboard-middleware'

export async function start() {
  dotenv.config({
    path: path.join(__dirname, '..', '..', '..', '.env'),
  })
  initializeSentry({ context: 'server' })
  const timer = createTimer()
  const cache =
    process.env?.CACHE_TYPE !== 'production'
      ? createEmptyCache()
      : createCache({ timer })
  const swrQueue = createSwrQueue({ cache, timer })
  const authServices = createAuthServices()
  await initializeServer({ cache, swrQueue, authServices })
}

async function initializeServer({
  cache,
  swrQueue,
  authServices,
}: {
  cache: Cache
  swrQueue: SwrQueue
  authServices: AuthServices
}) {
  const app = createApp()
  const dashboardPath = applySwrQueueDashboardMiddleware({ app })
  const graphqlPath = await applyGraphQLMiddleware({
    app,
    cache,
    swrQueue,
    authServices,
  })
  const kratosPath = applyKratosMiddleware({
    app,
    kratosAdmin: authServices.kratos.admin,
  })

  const port = 3001
  const host = `http://localhost:${port}`
  app.listen({ port }, () => {
    /* eslint-disable no-console */
    console.log('🚀 Server ready')
    console.log(`Playground:          ${host}/___graphql`)
    console.log(`GraphQL endpoint:    ${host}${graphqlPath}`)
    console.log(`SWR Queue Dashboard: ${host}${dashboardPath}`)
    console.log(`Kratos endpoint:     ${host}${kratosPath}`)
    /* eslint-enable no-console */
  })
}
