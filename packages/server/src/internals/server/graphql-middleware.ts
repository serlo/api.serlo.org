import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { Storage } from '@google-cloud/storage'
import { defaultImport } from 'default-import'
import { Express, json } from 'express'
import { GraphQLError, GraphQLFormattedError } from 'graphql'
import createPlayground_ from 'graphql-playground-middleware-express'
import * as t from 'io-ts'
import jwt from 'jsonwebtoken'
import { type Pool } from 'mysql2/promise'
import * as R from 'ramda'

import { Context } from '~/context'
import { AuthServices, IdentityDecoder } from '~/context/auth-services'
import { Cache } from '~/context/cache'
import { Service } from '~/context/service'
import { SwrQueue } from '~/context/swr-queue'
import { Database } from '~/database'
import { handleAuthentication } from '~/internals/authentication'
import { ModelDataSource } from '~/internals/data-source'
import { createSentryPlugin } from '~/internals/sentry'
import { schema } from '~/schema'
import { Timer } from '~/timer'

const SessionDecoder = t.type({
  identity: IdentityDecoder,
})

export async function applyGraphQLMiddleware({
  app,
  cache,
  swrQueue,
  authServices,
  pool,
  timer,
}: {
  app: Express
  cache: Cache
  swrQueue: SwrQueue
  authServices: AuthServices
  pool: Pool
  timer: Timer
}) {
  const graphQLPath = '/graphql'
  const environment = {
    cache,
    swrQueue,
    authServices,
    database: new Database(pool),
    timer,
  }
  const server = new ApolloServer<Context>(getGraphQLOptions())
  const createPlayground = defaultImport(createPlayground_)
  await server.start()

  app.use(json({ limit: '2mb' }))
  app.use(
    graphQLPath,
    expressMiddleware(server, {
      async context({ req }): Promise<Context> {
        const googleStorage = new Storage()
        const database = new Database(pool)
        const dataSources = {
          model: new ModelDataSource(environment),
        }
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) {
          return Promise.resolve({
            dataSources,
            service: Service.SerloCloudflareWorker,
            userId: null,
            googleStorage,
            database,
            cache,
            swrQueue,
            authServices,
            timer,
          })
        }
        const partialContext = await handleAuthentication(
          authorizationHeader,
          async () => {
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
          },
        )
        return {
          ...partialContext,
          dataSources,
          googleStorage,
          database,
          cache,
          swrQueue,
          authServices,
          timer,
        }
      },
    }),
  )
  app.get('/___graphql', (...args) => {
    const headers =
      process.env.NODE_ENV === 'production'
        ? {}
        : { headers: { Authorization: `Serlo Service=${getToken()}` } }
    return createPlayground({ endpoint: graphQLPath, ...headers })(...args)
  })

  return graphQLPath
}

export function getGraphQLOptions() {
  return {
    typeDefs: schema.typeDefs,
    resolvers: schema.resolvers,
    // Needed for playground
    introspection: true,
    plugins: [
      // We add the playground via express middleware in src/index.ts
      ApolloServerPluginLandingPageDisabled(),
      createSentryPlugin(),
    ],
    formatError(error: GraphQLFormattedError) {
      return R.path(['response', 'status'], error.extensions) === 400
        ? new GraphQLError(error.message, {
            extensions: { ...error.extensions, code: 'BAD_REQUEST' },
          })
        : error
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
