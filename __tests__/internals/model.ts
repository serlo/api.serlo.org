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
import BeeQueue from 'bee-queue'
import { option as O } from 'fp-ts'

import { user as currentUser, user2 as staleUser } from '../../__fixtures__'
import { createUuidHandler } from '../__utils__'
import { Environment } from '~/internals/environment'
import { createFetchHelpersFromNodeFetch } from '~/internals/model'
import { createSwrQueue, UpdateJob } from '~/internals/swr-queue'
import { createSerloModel } from '~/model'

const swrQueue = createSwrQueue({
  cache: global.cache,
  timer: global.timer,
})

const beeQueue = (swrQueue._queue as unknown) as BeeQueue<UpdateJob>

const environment: Environment = {
  swrQueue,
  cache: global.cache,
}

beforeEach(async () => {
  await swrQueue.ready()
})

afterAll(async () => {
  await swrQueue.quit()
})

describe('createQuery', () => {
  const model = createSerloModel({
    environment,
    fetchHelpers: createFetchHelpersFromNodeFetch(),
  })
  const payload = { id: currentUser.id }
  const key = model.getUuid._querySpec.getKey(payload)

  async function waitForJob() {
    const job = await beeQueue.getJob(key)
    if (job === null) return
    await new Promise<void>((resolve) => {
      job.on('succeeded', () => {
        resolve()
      })
    })
  }

  beforeEach(() => {
    global.server.use(createUuidHandler(currentUser))
  })

  describe('Cold Cache', () => {
    test('returns current value', async () => {
      expect(await model.getUuid(payload)).toEqual(currentUser)
      await waitForJob()
    })
  })

  describe('Warm Cache', () => {
    test('Non-stale value', async () => {
      await global.cache.set({ key, value: staleUser })
      expect(await model.getUuid(payload)).toEqual(staleUser)
      await waitForJob()
      const cacheValue = await global.cache.get({ key })
      expect(O.isSome(cacheValue) && cacheValue.value.value).toEqual(staleUser)
    })

    test('Stale value', async () => {
      await global.cache.set({ key, value: staleUser })
      await global.timer.waitFor(model.getUuid._querySpec.maxAge!)
      await global.timer.waitFor({ minutes: 5 })
      expect(await model.getUuid(payload)).toEqual(staleUser)
      await waitForJob()
      const cacheValue = await global.cache.get({ key })
      expect(O.isSome(cacheValue) && cacheValue.value.value).toEqual(
        currentUser
      )
    })

    test('Stale value (re-queuing jobs)', async () => {
      // This test ensures that jobs can be queued again after completion
      const staleUser1 = { ...currentUser, username: 'Stale User 1' }
      const staleUser2 = { ...currentUser, username: 'Stale User 2' }
      await global.cache.set({ key, value: staleUser1 })
      await global.timer.waitFor(model.getUuid._querySpec.maxAge!)
      await global.timer.waitFor({ minutes: 5 })
      global.server.use(createUuidHandler(staleUser2))
      expect(await model.getUuid(payload)).toEqual(staleUser1)
      await waitForJob()
      const cacheValue1 = await global.cache.get({ key })
      expect(O.isSome(cacheValue1) && cacheValue1.value.value).toEqual(
        staleUser2
      )
      await global.timer.waitFor(model.getUuid._querySpec.maxAge!)
      await global.timer.waitFor({ minutes: 5 })
      global.server.use(createUuidHandler(currentUser))
      expect(await model.getUuid(payload)).toEqual(staleUser2)
      await waitForJob()
      const cacheValue2 = await global.cache.get({ key })
      expect(O.isSome(cacheValue2) && cacheValue2.value.value).toEqual(
        currentUser
      )
    })
  })
})
