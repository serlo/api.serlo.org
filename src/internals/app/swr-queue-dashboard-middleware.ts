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
import auth from 'basic-auth'
import Bee from 'bee-queue'
import createMiddleware from 'bull-arena'
import { Express, RequestHandler } from 'express'

import { redisUrl } from '~/internals/redis-url'
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
      credentials.name === process.env.SWR_QUEUE_DASHBOARD_USERNAME &&
      credentials.pass === process.env.SWR_QUEUE_DASHBOARD_PASSWORD
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
          url: redisUrl,
        },
      ],
    },
    {
      disableListen: true,
      useCdn: false,
    }
  )
}
