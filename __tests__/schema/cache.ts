/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */

import { option } from 'fp-ts'

import {
  createRemoveCacheMutation,
  createSetCacheMutation,
  createUpdateCacheMutation,
  user,
} from '../../__fixtures__'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  createTestClient,
} from '../__utils__'
import { Service } from '~/internals/authentication'

const testVars = [
  {
    key: 'foo',
    value: { anything: 'bar' },
  },
  {
    key: 'bar.fuss',
    value: ['whatever'],
  },
]

test('_setCache (forbidden)', async () => {
  const client = createTestClient({
    service: Service.SerloCloudflareWorker,
    userId: null,
  })

  await assertFailingGraphQLMutation({
    ...createSetCacheMutation(testVars[0]),
    client,
    expectedError: 'FORBIDDEN',
  })
})

test('_setCache (authenticated)', async () => {
  const client = createTestClient({
    service: Service.Serlo,
    userId: null,
  })
  const now = global.timer.now()

  await assertSuccessfulGraphQLMutation({
    ...createSetCacheMutation(testVars[0]),
    client,
  })

  const cachedValue = await global.cache.get({ key: testVars[0].key })
  expect(option.isSome(cachedValue) && cachedValue.value).toEqual({
    lastModified: now,
    value: testVars[0].value,
  })
})

test('_removeCache (forbidden with not logged in user)', async () => {
  const client = createTestClient({
    service: Service.SerloCloudflareWorker,
    userId: null,
  })
  await assertFailingGraphQLMutation({
    ...createRemoveCacheMutation(testVars[0]),
    client,
    expectedError: 'FORBIDDEN',
  })
})

test('_removeCache (forbidden with wrong user)', async () => {
  const client = createTestClient({
    service: Service.SerloCloudflareWorker,
    userId: user.id,
  })
  await assertFailingGraphQLMutation({
    ...createRemoveCacheMutation(testVars[0]),
    client,
    expectedError: 'FORBIDDEN',
  })
})

test('_removeCache (authenticated via Serlo Service)', async () => {
  const client = createTestClient({
    service: Service.Serlo,
    userId: null,
  })

  await assertSuccessfulGraphQLMutation({
    ...createRemoveCacheMutation(testVars[0]),
    client,
  })

  const cachedValue = await global.cache.get({ key: testVars[0].key })
  expect(option.isNone(cachedValue)).toBe(true)
})

test('_removeCache (authenticated as CarolinJaser)', async () => {
  const client = createTestClient({
    service: Service.SerloCloudflareWorker,
    userId: 178145,
  })

  await assertSuccessfulGraphQLMutation({
    ...createRemoveCacheMutation(testVars[0]),
    client,
  })

  const cachedValue = await global.cache.get({ key: testVars[0].key })
  expect(option.isNone(cachedValue)).toBe(true)
})

test('_updateCache (forbidden)', async () => {
  const client = createTestClient({
    service: Service.SerloCloudflareWorker,
    userId: null,
  })
  await assertFailingGraphQLMutation({
    ...createUpdateCacheMutation(['I', 'will', 'fail']),
    client,
    expectedError: 'FORBIDDEN',
  })
})
