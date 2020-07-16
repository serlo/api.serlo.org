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

import { createInMemoryCache } from './cache/in-memory-cache'
import { createRedisCache } from './cache/redis-cache'
import { getGraphQLOptions } from './graphql'
import { Service } from './graphql/schema/types'

start()

function start() {
  dotenv.config()
  const app = createApp()
  const graphqlPath = applyGraphQLMiddleware(app)

  app.listen({ port: 3000 }, () => {
    console.log('🚀 Server ready')
    console.log('Playground:       http://localhost:3000/___graphql')
    console.log(`GraphQL endpoint: http://localhost:3000${graphqlPath}`)
  })
}

function applyGraphQLMiddleware(app: Express) {
  const environment = {
    cache:
      process.env.REDIS_HOST === undefined
        ? createInMemoryCache()
        : createRedisCache({ host: process.env.REDIS_HOST }),
  }
  const server = new ApolloServer(getGraphQLOptions(environment))

  app.use(server.getMiddleware({ path: '/graphql' }))
  app.get('/___graphql', (...args) => {
    const token = jwt.sign({}, process.env.PLAYGROUND_SECRET, {
      expiresIn: '2h',
      audience: 'api.serlo.org',
      issuer: Service.Playground,
    })

    return createPlayground({
      endpoint: '/graphql',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error Not documented but we can pass custom headers
      headers: {
        Authorization: `Serlo Service=${token}`,
      },
    })(...args)
  })

  return server.graphqlPath
}
