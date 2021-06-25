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
import {
  ApolloError,
  ApolloServer,
  ApolloServerExpressConfig,
} from 'apollo-server-express'
import { Express, json } from 'express'
import createPlayground from 'graphql-playground-middleware-express'
import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'
import * as R from 'ramda'
import { URLSearchParams } from 'url'

import { handleAuthentication, Service } from '~/internals/authentication'
import { Cache } from '~/internals/cache'
import { ModelDataSource } from '~/internals/data-source'
import { Environment } from '~/internals/environment'
import { Context } from '~/internals/graphql'
import { createSentryPlugin } from '~/internals/sentry'
import { createInvalidCurrentValueErrorPlugin } from '~/internals/server/invalid-current-value-error-plugin'
import { SwrQueue } from '~/internals/swr-queue'
import { schema } from '~/schema'

export function applyGraphQLMiddleware({
  app,
  cache,
  swrQueue,
}: {
  app: Express
  cache: Cache
  swrQueue: SwrQueue
}) {
  const environment = { cache, swrQueue }
  const server = new ApolloServer(getGraphQLOptions(environment))
  const headers =
    process.env.NODE_ENV === 'production'
      ? {}
      : { headers: { Authorization: `Serlo Service=${getToken()}` } }

  app.use(json({ limit: '2mb' }))
  app.use(
    server.getMiddleware({
      path: '/graphql',
      onHealthCheck: async () => {
        await swrQueue.healthy()
      },
    })
  )
  app.get('/___graphql', (...args) => {
    return createPlayground({ endpoint: '/graphql', ...headers })(...args)
  })

  return server.graphqlPath
}

export function getGraphQLOptions(
  environment: Environment
): ApolloServerExpressConfig {
  return {
    typeDefs: schema.typeDefs,
    resolvers: schema.resolvers,
    // Needed for playground
    introspection: true,
    // We add the playground via express middleware in src/index.ts
    playground: false,
    plugins: [
      createInvalidCurrentValueErrorPlugin({ environment }),
      createSentryPlugin(),
    ],
    dataSources() {
      return {
        model: new ModelDataSource(environment),
      }
    },
    formatError(error) {
      return R.path(['response', 'status'], error.extensions) === 400
        ? new ApolloError(error.message, 'BAD_REQUEST', error.extensions)
        : error
    },
    context({ req }): Promise<Pick<Context, 'service' | 'userId'>> {
      const authorizationHeader = req.headers.authorization
      if (!authorizationHeader) {
        return Promise.resolve({
          service: Service.SerloCloudflareWorker,
          userId: null,
        })
      }
      return handleAuthentication(authorizationHeader, async (token) => {
        if (process.env.SERVER_HYDRA_HOST === undefined) return null
        const params = new URLSearchParams()
        params.append('token', token)
        const response = await fetch(
          `${process.env.SERVER_HYDRA_HOST}/oauth2/introspect`,
          {
            method: 'post',
            body: params,
            headers: {
              'X-Forwarded-Proto': 'https',
            },
          }
        )
        const { active, sub } = (await response.json()) as {
          active: boolean
          sub: string
        }

        if (active) parseInt(sub, 10)
        throw new ApolloError('Token expired or invalid', 'INVALID_TOKEN')
      })
    },
  }
}

function getToken() {
  return jwt.sign({}, process.env.SERVER_SERLO_CLOUDFLARE_WORKER_SECRET, {
    expiresIn: '2h',
    audience: 'api.serlo.org',
    issuer: Service.SerloCloudflareWorker,
  })
}
