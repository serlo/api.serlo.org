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
import { SharedOptions } from 'msw/lib/types/sharedOptions'
import { setupServer } from 'msw/node'

import { createCache } from '../src/cache'

export function setup() {
  const timer = { now: jest.fn<number, never>() }
  const cache = createCache({ host: process.env.REDIS_HOST, timer })
  const server = setupServer()

  global.cache = cache
  global.server = server
  global.timer = timer
}

export function createBeforeAll(options: SharedOptions) {
  global.server.listen(options)
}

export async function createBeforeEach() {
  await global.cache.flush()
  global.timer.now.mockReturnValue(Date.now())
}

export function createAfterEach() {
  global.server.resetHandlers()
}

export async function createAfterAll() {
  global.server.close()
  await global.cache.quit()
  // redis.quit() creates a thread to close the connection.
  // We wait until all threads have been run once to ensure the connection closes.
  await new Promise((resolve) => setImmediate(resolve))
}
