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
import { applyEnmeshedMiddleware } from '~/internals/server/enmeshed-middleware'
import { applyKratosMiddleware } from '~/internals/server/kratos-middleware'

export { getGraphQLOptions } from './graphql-middleware'

export async function start() {
  dotenv.config({
    path: path.join(__dirname, '..', '..', '..', '.env'),
  })
  initializeSentry({ context: 'server' })
  const timer = createTimer()
  const cache =
    process.env.CACHE_TYPE === 'empty'
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
  const healthPath = '/health'
  const dashboardPath = applySwrQueueDashboardMiddleware({ app })
  const graphqlPath = await applyGraphQLMiddleware({
    app,
    cache,
    swrQueue,
    authServices,
  })
  const kratosPath = applyKratosMiddleware({
    app,
    kratos: authServices.kratos,
  })
  const enmeshedPath = applyEnmeshedMiddleware({ app, cache })

  app.get(healthPath, (req, res) => {
    res.status(200).send('Okay!')
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
    console.log(`Health endpoint:     ${host}${healthPath}`)
    if (enmeshedPath) {
      console.log(`Enmeshed endpoint:   ${host}${enmeshedPath}`)
    }
    /* eslint-enable no-console */
  })
}
