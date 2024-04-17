import dotenv from 'dotenv'
import createApp from 'express'
import { Pool, createPool } from 'mysql2/promise'

import { applyGraphQLMiddleware } from './graphql-middleware'
import { applySwrQueueDashboardMiddleware } from './swr-queue-dashboard-middleware'
import { createAuthServices, AuthServices } from '../authentication'
import { createCache, createEmptyCache } from '../cache'
import { initializeSentry } from '../sentry'
import { createSwrQueue } from '../swr-queue'
import { SwrQueue } from '~/context/swr-queue'
import { Cache } from '~/context/cache'
import { applyEnmeshedMiddleware } from '~/internals/server/enmeshed-middleware'
import { applyKratosMiddleware } from '~/internals/server/kratos-middleware'
import { createTimer } from '~/timer'

export { getGraphQLOptions } from './graphql-middleware'

export async function start() {
  dotenv.config()

  initializeSentry({ context: 'server' })
  const timer = createTimer()
  const cache =
    process.env.CACHE_TYPE === 'empty'
      ? createEmptyCache()
      : createCache({ timer })
  const swrQueue = createSwrQueue({ cache, timer })
  const authServices = createAuthServices()
  const pool = createPool(process.env.MYSQL_URI)
  await initializeServer({ cache, swrQueue, authServices, pool })
}

async function initializeServer({
  cache,
  swrQueue,
  authServices,
  pool,
}: {
  cache: Cache
  swrQueue: SwrQueue
  authServices: AuthServices
  pool: Pool
}) {
  const app = createApp()
  const healthPath = '/health'
  const dashboardPath = applySwrQueueDashboardMiddleware({ app })
  const graphqlPath = await applyGraphQLMiddleware({
    app,
    cache,
    swrQueue,
    authServices,
    pool,
  })
  const kratosPath = applyKratosMiddleware({
    app,
    kratos: authServices.kratos,
  })
  const enmeshedPath = applyEnmeshedMiddleware({ app, cache })

  app.get(healthPath, (_req, res) => {
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
