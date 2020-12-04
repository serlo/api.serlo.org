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
import { option as O } from 'fp-ts'
import fetch from 'node-fetch'

import { user } from '../../__fixtures__'
import { createLockManager } from '../../src/lock-manager'
import { createModel } from '../../src/model'
import { createSwrQueue } from '../../src/swr-queue'
import { createUuidHandler, waitFor } from '../__utils__'

const host = process.env.REDIS_HOST

// TODO: change CI so that redis is started beforehand

// For background updates, we just skip the update when the resource is already locked.
// The resolvers with important updates should instead use a high retryCount
const lockManager = createLockManager({
  host,
  retryCount: 0,
})
const model = createModel({
  cache: global.cache,
  lockManager,
  fetch: async ({ path, ...init }) => {
    try {
      const response = await fetch(path, init)
      return (await response.json()) as unknown
    } catch (e) {
      console.log(e)
    }
  },
})
const swrQueue = createSwrQueue({
  cache: global.cache,
  model,
  timer: global.timer,
  host,
})

afterAll(async () => {
  await lockManager.quit()
  await swrQueue.quit()
})

test('serlo.org', async () => {
  global.server.use(createUuidHandler(user))
  await model.update('de.serlo.org/api/uuid/1')
  const { lastModified, value } = O.toNullable(
    await global.cache.get('de.serlo.org/api/uuid/1')
  )!
  expect(lastModified).toBeDefined()
  expect(value).toEqual(user)
})

test("Skips update when lock couldn't be acquired", async () => {
  // TODO: Hacky flag since we really only want to allow one request here.
  global.server.use(createUuidHandler(user, true))
  await Promise.all([
    model.update('de.serlo.org/api/uuid/1'),
    model.update('de.serlo.org/api/uuid/1'),
  ])
  const { lastModified, value } = O.toNullable(
    await global.cache.get('de.serlo.org/api/uuid/1')
  )!
  expect(lastModified).toBeDefined()
  expect(value).toEqual(user)
})

// TODO: This is still a bit hacky, re-implement tests from CacheableDataSource
describe('Background Queue', () => {
  test('Stale', async () => {
    global.server.use(createUuidHandler(user))
    const key = 'de.serlo.org/api/uuid/1'
    await global.cache.set(key, 'Stale value')
    await waitFor(20)
    const job = await swrQueue.queue({ key, maxAge: 10 })
    await new Promise((resolve) => {
      job.on('succeeded', () => {
        void global.cache.get('de.serlo.org/api/uuid/1').then((v) => {
          const { lastModified, value } = O.toNullable(v)!
          expect(lastModified).toBeDefined()
          expect(value).toEqual(user)
          resolve()
        })
      })
    })
  })

  test('Non-stale', async () => {
    const key = 'de.serlo.org/api/uuid/1'
    await global.cache.set(key, user)
    await waitFor(5)
    const job = await swrQueue.queue({ key, maxAge: 10 })
    await new Promise((resolve) => {
      job.on('succeeded', () => {
        void global.cache.get('de.serlo.org/api/uuid/1').then((v) => {
          const { lastModified, value } = O.toNullable(v)!
          expect(lastModified).toBeDefined()
          expect(value).toEqual(user)
          resolve()
        })
      })
    })
  })

  test('MaxAge = undefined', async () => {
    const key = 'de.serlo.org/api/uuid/1'
    await global.cache.set(key, user)
    await waitFor(9999999999999)
    const job = await swrQueue.queue({ key })
    await new Promise((resolve) => {
      job.on('succeeded', () => {
        void global.cache.get('de.serlo.org/api/uuid/1').then((v) => {
          const { lastModified, value } = O.toNullable(v)!
          expect(lastModified).toBeDefined()
          expect(value).toEqual(user)
          resolve()
        })
      })
    })
  })
})
