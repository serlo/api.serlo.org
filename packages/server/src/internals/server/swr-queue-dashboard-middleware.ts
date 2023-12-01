import auth from 'basic-auth'
import Bee from 'bee-queue'
import createMiddleware from 'bull-arena'
import { Express, RequestHandler } from 'express'

import { queueName } from '~/internals/swr-queue'

export function applySwrQueueDashboardMiddleware({ app }: { app: Express }) {
  const dashboardPath = '/swr-queue'
  app.use(dashboardPath, createAuthMiddleware(), createDashboardMiddleware())
  return dashboardPath
}

function createAuthMiddleware(): RequestHandler {
  return (req, res, next) => {
    // Skip authentication for local environment
    if (process.env.ENVIRONMENT === 'local') return next()

    const credentials = auth(req)

    if (
      credentials &&
      credentials.name === process.env.SERVER_SWR_QUEUE_DASHBOARD_USERNAME &&
      credentials.pass === process.env.SERVER_SWR_QUEUE_DASHBOARD_PASSWORD
    ) {
      return next()
    }

    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="SWR Queue Dashboard"')
    res.end('Access denied')
  }
}

function createDashboardMiddleware(): RequestHandler {
  return createMiddleware(
    {
      Bee,
      queues: [
        {
          name: queueName,
          hostId: 'SWR Queue',
          type: 'bee',
          url: process.env.REDIS_URL,
        },
      ],
    },
    {
      disableListen: true,
      useCdn: false,
    },
  )
}
