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
import { createSwrQueue } from '../../src/internals/swr-queue'

const swrQueue = createSwrQueue({
  cache: global.cache,
  timer: global.timer,
})

beforeEach(async () => {
  await swrQueue.ready()
})

afterAll(async () => {
  await swrQueue.quit()
})

test.todo('skip')

// TODO: This is still a bit hacky, re-implement tests from CacheableDataSource
// describe('Background Queue', () => {
//   test('Stale', async () => {
//     global.server.use(createUuidHandler(user))
//     const key = 'de.serlo.org/api/uuid/1'
//     await global.cache.set({ key, value: 'Stale value' })
//     // TODO: implementation detail!
//     await global.timer.waitFor(10 * MINUTE)
//     const job = (await swrQueue.queue({ key, maxAge: 10 })) as Queue.Job<
//       UpdateJob
//     >
//     await new Promise((resolve) => {
//       job.on('succeeded', () => {
//         void global.cache.get({ key: 'de.serlo.org/api/uuid/1' }).then((v) => {
//           const { lastModified, value } = O.toNullable(v)!
//           expect(lastModified).toBeDefined()
//           expect(value).toEqual(user)
//           resolve()
//         })
//       })
//     })
//   })
//
//   test('Non-stale', async () => {
//     const key = 'de.serlo.org/api/uuid/1'
//     await global.cache.set({ key, value: user })
//     await global.timer.waitFor(5)
//     const job = (await swrQueue.queue({ key, maxAge: 10 })) as Queue.Job<
//       UpdateJob
//     >
//     await new Promise((resolve) => {
//       job.on('succeeded', () => {
//         void global.cache.get({ key: 'de.serlo.org/api/uuid/1' }).then((v) => {
//           const { lastModified, value } = O.toNullable(v)!
//           expect(lastModified).toBeDefined()
//           expect(value).toEqual(user)
//           resolve()
//         })
//       })
//     })
//   })
//
//   // TODO: this doesn't make sense anymore
//   // test.only('MaxAge = undefined', async () => {
//   //   const key = 'de.serlo.org/api/uuid/1'
//   //   await global.cache.set({ key, value: user })
//   //   await global.timer.waitFor(9999999999999)
//   //   const job = (await swrQueue.queue({ key })) as Queue.Job<UpdateJob>
//   //   await new Promise((resolve) => {
//   //     job.on('succeeded', () => {
//   //       void global.cache.get({ key: 'de.serlo.org/api/uuid/1' }).then((v) => {
//   //         const { lastModified, value } = O.toNullable(v)!
//   //         expect(lastModified).toBeDefined()
//   //         expect(value).toEqual(user)
//   //         resolve()
//   //       })
//   //     })
//   //   })
//   // })
// })
