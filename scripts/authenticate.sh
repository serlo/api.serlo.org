#!/bin/bash

source scripts/utils.sh

if [ -z $1 ]; then
  user_id=1
else
  user_id=$1
fi

echo "
import { ApolloServerPluginLandingPageDisabled } from 'apollo-server-core'
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

export async function applyGraphQLMiddleware({
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
  await server.start()

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
    const headers =
      process.env.NODE_ENV === 'production'
        ? {}
        : { headers: { Authorization: \`Serlo Service=\${getToken()}\` } }
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
    plugins: [
      // We add the playground via express middleware in src/index.ts
      ApolloServerPluginLandingPageDisabled(),
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
    context(): Promise<Pick<Context, 'service' | 'userId'>> {
      return Promise.resolve({
        service: Service.SerloCloudflareWorker,
        userId: $user_id,
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

" > packages/server/src/internals/server/graphql-middleware.ts

print_header "Authenticated as user with id $user_id"
echo "The file packages/server/src/internals/server/graphql-middleware.ts was changed in order to allow authentication."
echo "Important: Do not commit this file!"
echo "If you are editing this file, do not use this script!"
echo "Exit: ctrl+C"

trap restore_graphql_middleware SIGINT

restore_graphql_middleware() {
  echo "Restoring packages/server/src/internals/server/graphql-middleware.ts to original state"
  git restore packages/server/src/internals/server/graphql-middleware.ts
}

sleep 99999m
