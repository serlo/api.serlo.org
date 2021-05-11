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
import { gql } from 'apollo-server'
import { option } from 'fp-ts'

import { createRemoveCacheMutation, user } from '../../__fixtures__'
import {
  assertErrorEvent,
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

describe('set', () => {
  const key = 'de.serlo.org/api/uuid/1'
  const mutation = gql`
    mutation ($input: CacheSetInput!) {
      _cache {
        set(input: $input) {
          success
        }
      }
    }
  `

  test('is forbidden when service is not legacy serlo.org', async () => {
    const client = createTestClient({ service: Service.SerloCloudflareWorker })

    await assertFailingGraphQLMutation({
      mutation,
      variables: { input: { key, value: user } },
      client,
      expectedError: 'FORBIDDEN',
    })
  })

  test('sets a certain cache value', async () => {
    const client = createTestClient({ service: Service.Serlo })
    const now = global.timer.now()

    await assertSuccessfulGraphQLMutation({
      mutation,
      variables: { input: { key, value: user } },
      client,
      data: { _cache: { set: { success: true } } },
    })

    const cachedValue = await global.cache.get({ key })
    expect(option.isSome(cachedValue) && cachedValue.value).toEqual({
      lastModified: now,
      value: user,
    })
  })

  test('reports an error when value was invalid', async () => {
    const invalidValue = { value: 'Some invalid value' }
    const client = createTestClient({ service: Service.Serlo })

    await assertFailingGraphQLMutation({
      mutation,
      variables: { input: { key, value: invalidValue } },
      client,
      expectedError: 'INTERNAL_SERVER_ERROR',
    })

    await assertErrorEvent({
      message: 'Invalid value received from listener.',
      errorContext: { key, invalidValueFromListener: invalidValue },
    })
  })
})

test('remove (forbidden with not logged in user)', async () => {
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

test('remove (forbidden with wrong user)', async () => {
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

test('remove (authenticated via Serlo Service)', async () => {
  const client = createTestClient({
    service: Service.Serlo,
    userId: null,
  })

  await assertSuccessfulGraphQLMutation({
    ...createRemoveCacheMutation(testVars[0]),
    client,
    data: { _cache: { remove: { success: true } } },
  })

  const cachedValue = await global.cache.get({ key: testVars[0].key })
  expect(option.isNone(cachedValue)).toBe(true)
})

test('remove (authenticated as CarolinJaser)', async () => {
  const client = createTestClient({
    service: Service.SerloCloudflareWorker,
    userId: 178145,
  })

  await assertSuccessfulGraphQLMutation({
    ...createRemoveCacheMutation(testVars[0]),
    client,
    data: { _cache: { remove: { success: true } } },
  })

  const cachedValue = await global.cache.get({ key: testVars[0].key })
  expect(option.isNone(cachedValue)).toBe(true)
})

describe('update', () => {
  test('is forbidden when service is not legacy serlo.org', async () => {
    const client = createTestClient({ service: Service.SerloCloudflareWorker })

    await assertFailingGraphQLMutation({
      mutation: gql`
        mutation ($input: CacheUpdateInput!) {
          _cache {
            update(input: $input) {
              success
            }
          }
        }
      `,
      variables: { input: { keys: ['key1', 'key2'] } },
      client,
      expectedError: 'FORBIDDEN',
    })
  })
})
