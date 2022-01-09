/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import dotenv from 'dotenv'
import createApp from 'express'
import path from 'path'

import { createCache } from './cache'
import { initializeSentry } from './sentry'
import { createSwrQueueWorker } from './swr-queue'
import { createTimer } from './timer'

export async function start() {
  dotenv.config({
    path: path.join(__dirname, '..', '..', '..', '.env'),
  })
  initializeSentry({ context: 'swr-queue-worker' })
  const timer = createTimer()
  const cache = createCache({ timer })
  const swrQueueWorker = createSwrQueueWorker({
    cache,
    timer,
    concurrency: parseInt(process.env.SWR_QUEUE_WORKER_CONCURRENCY, 10),
  })
  await swrQueueWorker.ready()

  const app = createApp()
  app.get('/.well-known/health', (_req, res) => {
    swrQueueWorker
      .healthy()
      .then(() => {
        res.sendStatus(200)
      })
      .catch(() => {
        res.sendStatus(503)
      })
  })
  app.listen({ port: 3000 }, () => {
    // eslint-disable-next-line no-console
    console.log('🚀 SWR Queue Worker ready')
  })
}
