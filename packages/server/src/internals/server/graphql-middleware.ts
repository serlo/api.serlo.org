import { ApolloServerPluginLandingPageDisabled } from 'apollo-server-core'
import {
  ApolloError,
  ApolloServer,
  ApolloServerExpressConfig,
} from 'apollo-server-express'
import { Express, json } from 'express'
import createPlayground from 'graphql-playground-middleware-express'
import * as t from 'io-ts'
import jwt from 'jsonwebtoken'
import * as R from 'ramda'

import {
  AuthServices,
  handleAuthentication,
  IdentityDecoder,
  Service,
} from '~/internals/authentication'
import { Cache } from '~/internals/cache'
import { ModelDataSource } from '~/internals/data-source'
import { Environment } from '~/internals/environment'
import { Context } from '~/internals/graphql'
import { createSentryPlugin } from '~/internals/sentry'
import { createInvalidCurrentValueErrorPlugin } from '~/internals/server/invalid-current-value-error-plugin'
import { SwrQueue } from '~/internals/swr-queue'
import { schema } from '~/schema'

const SessionDecoder = t.type({
  identity: IdentityDecoder,
})

export async function applyGraphQLMiddleware({
  app,
  cache,
  swrQueue,
  authServices,
}: {
  app: Express
  cache: Cache
  swrQueue: SwrQueue
  authServices: AuthServices
}) {
  const environment = { cache, swrQueue, authServices }
  const server = new ApolloServer(getGraphQLOptions(environment))
  await server.start()

  app.use(json({ limit: '2mb' }))
  app.use(
    server.getMiddleware({
      path: '/graphql',
      onHealthCheck: async () => {
        await swrQueue.healthy()
      },
    }),
  )
  app.get('/___graphql', (...args) => {
    const headers =
      process.env.NODE_ENV === 'production'
        ? {}
        : { headers: { Authorization: `Serlo Service=${getToken()}` } }
    return createPlayground({ endpoint: '/graphql', ...headers })(...args)
  })

  return server.graphqlPath
}

export function getGraphQLOptions(
  environment: Environment,
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
    context({ req }): Promise<Pick<Context, 'service' | 'userId'>> {
      const authorizationHeader = req.headers.authorization
      if (!authorizationHeader) {
        return Promise.resolve({
          service: Service.SerloCloudflareWorker,
          userId: null,
        })
      }
      return handleAuthentication(authorizationHeader, async () => {
        try {
          const publicKratos = environment.authServices.kratos.public
          const session = (
            await publicKratos.toSession({ cookie: req.header('cookie') })
          ).data

          if (SessionDecoder.is(session)) {
            // TODO: When the time comes change it to session.identity.id
            return session.identity.metadata_public.legacy_id
          } else {
            return null
          }
        } catch {
          // the user is probably unauthenticated
          return null
        }
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
