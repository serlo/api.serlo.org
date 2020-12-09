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
import { ApolloServer } from 'apollo-server-express'
import dotenv from 'dotenv'
import createApp, { Express } from 'express'
import createPlayground from 'graphql-playground-middleware-express'
import jwt from 'jsonwebtoken'

import { Cache, createCache } from './cache'
import { getGraphQLOptions } from './graphql'
import { Service } from './graphql/schema/types'
// eslint-disable-next-line import/no-unassigned-import
import './sentry'
import { createLockManager } from './lock-manager'
import { createModel } from './model'
import { createSwrQueue, SwrQueue } from './swr-queue'
import { createTimer } from './timer'

start()

function start() {
  dotenv.config()
  const timer = createTimer()
  const cache = createCache({ timer })
  const model = createModel({
    cache,
    lockManager: createLockManager({ retryCount: 0 }),
  })
  const swrQueue = createSwrQueue({
    cache,
    model,
    timer,
  })
  const app = createApp()
  const graphqlPath = applyGraphQLMiddleware({ app, cache, swrQueue })

  app.listen({ port: 3000 }, () => {
    console.log('🚀 Server ready')
    console.log('Playground:       http://localhost:3000/___graphql')
    console.log(`GraphQL endpoint: http://localhost:3000${graphqlPath}`)
  })
}

function applyGraphQLMiddleware({
  app,
  cache,
  swrQueue,
}: {
  app: Express
  cache: Cache
  swrQueue: SwrQueue
}) {
  const environment = {
    cache,
    lockManager: createLockManager({ retryCount: 5 }),
    swrQueue,
  }
  const server = new ApolloServer(getGraphQLOptions(environment))

  app.use(server.getMiddleware({ path: '/graphql' }))
  app.get('/___graphql', (...args) => {
    return createPlayground({
      endpoint: '/graphql',
      ...(process.env.NODE_ENV === 'production'
        ? {}
        : {
            headers: {
              Authorization: `Serlo Service=${jwt.sign(
                {},
                process.env.SERLO_CLOUDFLARE_WORKER_SECRET,
                {
                  expiresIn: '2h',
                  audience: 'api.serlo.org',
                  issuer: Service.SerloCloudflareWorker,
                }
              )}`,
            },
          }),
    })(...args)
  })

  return server.graphqlPath
}
