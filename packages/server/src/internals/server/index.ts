import cors from 'cors'
import dotenv from 'dotenv'
import createApp from 'express'
import { Pool, createPool } from 'mysql2/promise'

import { applyGraphQLMiddleware } from './graphql-middleware'
import { applySwrQueueDashboardMiddleware } from './swr-queue-dashboard-middleware'
import { initializeSentry } from '../sentry'
import { createSwrQueue } from '../swr-queue'
import { createCache, createEmptyCache } from '~/cache'
import { createAuthServices, AuthServices } from '~/context/auth-services'
import { Cache } from '~/context/cache'
import { SwrQueue } from '~/context/swr-queue'
import { captureErrorEvent } from '~/error-event'
import { applyEnmeshedMiddleware } from '~/internals/server/enmeshed-middleware'
import { applyKratosMiddleware } from '~/internals/server/kratos-middleware'
import { Timer, createTimer } from '~/timer'

export { getGraphQLOptions } from './graphql-middleware'

export async function start() {
  dotenv.config()

  initializeSentry({ context: 'server' })
  const timer = createTimer()
  const cache =
    process.env.CACHE_TYPE === 'empty'
      ? createEmptyCache()
      : createCache({ timer })
  const pool = createPool(process.env.MYSQL_URI)
  const swrQueue = createSwrQueue({ cache, timer })
  const authServices = createAuthServices()
  await initializeServer({ cache, swrQueue, authServices, pool, timer })
}

async function initializeServer({
  cache,
  swrQueue,
  authServices,
  pool,
  timer,
}: {
  cache: Cache
  swrQueue: SwrQueue
  authServices: AuthServices
  pool: Pool
  timer: Timer
}) {
  const app = createApp()
  const healthPath = '/health'

  // Allow CORS in local environment since frontend is running on a different port
  // This allows us to test the frontend in a local environment with the API
  if (process.env.ENVIRONMENT === 'local') {
    app.use(cors())
  }

  const dashboardPath = applySwrQueueDashboardMiddleware({ app })
  const graphqlPath = await applyGraphQLMiddleware({
    app,
    cache,
    swrQueue,
    authServices,
    pool,
    timer,
  })
  const kratosPath = applyKratosMiddleware({
    app,
    kratos: authServices.kratos,
    pool,
  })
  const enmeshedPath = applyEnmeshedMiddleware({ app, cache })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.get(healthPath, async (_req, res) => {
    try {
      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: '{ uuid(id: 1) { id } }' }),
      })
      const data: unknown = await response.json()
      if (typeof data !== 'object' || !data || 'errors' in data) {
        return res
          .status(500)
          .send('Graphql operations dependent on Redis are broken')
      }
      res.status(200).send('Okay!')
    } catch (error) {
      res.status(500).send(`Unexpected error occurred`)
      captureErrorEvent({
        error: error as Error,
        location: '/health',
      })
    }
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
