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

import { createSwrQueue } from '../swr-queue'
import { createCache, createEmptyCache } from '~/cache'
import { Context } from '~/context'
import { AuthServices, IdentityDecoder } from '~/context/auth-services'
import { Service } from '~/context/service'
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
  authServices,
  pool,
  timer,
}: {
  app: Express
  authServices: AuthServices
  pool: Pool
  timer: Timer
}) {
  const graphQLPath = '/graphql'
  const server = new ApolloServer<Context>(getGraphQLOptions())
  const createPlayground = defaultImport(createPlayground_)
  await server.start()

  app.use(json({ limit: '2mb' }))
  app.use(
    graphQLPath,
    expressMiddleware(server, {
      async context({ req }): Promise<Context> {
        const cache =
          process.env.CACHE_TYPE === 'empty'
            ? createEmptyCache()
            : createCache({ timer })
        const googleStorage = new Storage()
        const database = new Database(pool)
        const swrQueue = createSwrQueue({ cache, timer, database })
        const environment = { cache, swrQueue, authServices, database, timer }
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
