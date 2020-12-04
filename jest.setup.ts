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
import { setupServer } from 'msw/node'

import { Cache, createCache } from './src/cache'
import { Timer as T } from './src/timer'

const timer = { now: jest.fn<number, never>() }
const cache = createCache({ host: process.env.REDIS_HOST, timer })
const server = setupServer()

global.cache = cache
global.server = server
global.timer = timer

beforeAll(() => {
  global.server.listen({ onUnhandledRequest: 'error' })
})

beforeEach(async () => {
  await cache.flush()
  global.timer.now.mockReturnValue(Date.now())
})

afterEach(() => {
  global.server.resetHandlers()
})

afterAll(async () => {
  server.close()
  await cache.quit()
})

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace NodeJS {
    interface Global {
      cache: Cache
      server: ReturnType<typeof import('msw/node').setupServer>
      timer: T & { now: jest.Mock<number, never> }
    }
  }
}
