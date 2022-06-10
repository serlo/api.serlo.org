/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import dotenv from 'dotenv'
import createApp from 'express'
import path from 'path'

import { Cache, createCache } from '../cache'
import { initializeSentry } from '../sentry'
import { createSwrQueue, SwrQueue } from '../swr-queue'
import { createTimer } from '../timer'
import { applyGraphQLMiddleware } from './graphql-middleware'
import { applySwrQueueDashboardMiddleware } from './swr-queue-dashboard-middleware'
import { applyVersionMiddleware } from './version-middleware'
import { applyEnmeshedMiddleware } from '~/internals/server/enmeshed-middleware'

export * from './graphql-middleware'
export * from './swr-queue-dashboard-middleware'

export async function start() {
  dotenv.config({
    path: path.join(__dirname, '..', '..', '..', '.env'),
  })
  initializeSentry({ context: 'server' })
  const timer = createTimer()
  const cache = createCache({ timer })
  const swrQueue = createSwrQueue({ cache, timer })
  await initializeServer({ cache, swrQueue })
}

async function initializeServer({
  cache,
  swrQueue,
}: {
  cache: Cache
  swrQueue: SwrQueue
}) {
  const app = createApp()
  const dashboardPath = applySwrQueueDashboardMiddleware({ app })
  const versionPath = applyVersionMiddleware({ app })
  const enmeshedPath = applyEnmeshedMiddleware({ app, cache })
  const graphqlPath = await applyGraphQLMiddleware({ app, cache, swrQueue })

  const port = 3001
  const host = `http://localhost:${port}`
  app.listen({ port }, () => {
    /* eslint-disable no-console */
    console.log('🚀 Server ready')
    console.log(`Playground:          ${host}/___graphql`)
    console.log(`Version:             ${host}${versionPath}`)
    console.log(`GraphQL Endpoint:    ${host}${graphqlPath}`)
    console.log(`SWR Queue Dashboard: ${host}${dashboardPath}`)
    if (enmeshedPath) {
      console.log(`Enmeshed Endpoint:   ${host}${enmeshedPath}`)
    }
    /* eslint-enable no-console */
  })
}
