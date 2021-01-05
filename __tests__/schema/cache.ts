/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */

import { option } from 'fp-ts'
import { rest } from 'msw'

import {
  createCacheKeysQuery,
  createRemoveCacheMutation,
  createSetCacheMutation,
  createUpdateCacheMutation,
  user,
  user2,
} from '../../__fixtures__'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
  createSpreadsheetHandler,
  createTestClient,
} from '../__utils__'
import { Service } from '~/internals/auth'
import { MajorDimension } from '~/model'

const mockSpreadSheetData = {
  spreadsheetId: process.env.ACTIVE_DONORS_SPREADSHEET_ID,
  range: 'Tabellenblatt1!A:A',
  majorDimension: MajorDimension.Columns,
  apiKey: 'very-secure-secret',
  body: {
    values: [['Ids', user.id.toString(), user2.id.toString()]],
    majorDimension: MajorDimension.Columns,
    range: 'Tabellenblatt1!A:A',
  },
}

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

const fakeCacheKeys = [testVars[0].key, testVars[1].key, 'uuid']

beforeEach(() => {
  global.server.use(
    rest.get(
      `http://de.${process.env.SERLO_ORG_HOST}/api/cache-keys`,
      (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(fakeCacheKeys))
      }
    ),
    rest.get(
      `http://de.${process.env.SERLO_ORG_HOST}/api/${testVars[0].key}`,
      (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(testVars[0].value))
      }
    ),
    rest.get(
      `http://en.${process.env.SERLO_ORG_HOST}/api/${testVars[1].key}`,
      (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(testVars[1].value))
      }
    ),
    createSpreadsheetHandler(mockSpreadSheetData)
  )
})

test('_cacheKeys', async () => {
  const client = createTestClient({
    service: Service.Serlo,
    user: null,
  })
  await assertSuccessfulGraphQLQuery({
    ...createCacheKeysQuery(),
    data: {
      _cacheKeys: {
        nodes: fakeCacheKeys,
        totalCount: 3,
      },
    },
    client,
  })
})

test('_setCache (forbidden)', async () => {
  const client = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: null,
  })

  await assertFailingGraphQLMutation(
    {
      ...createSetCacheMutation(testVars[0]),
      client,
    },
    (errors) => {
      expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
    }
  )
})

test('_setCache (authenticated)', async () => {
  const client = createTestClient({
    service: Service.Serlo,
    user: null,
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

test('_removeCache (forbidden)', async () => {
  const client = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: null,
  })
  await assertFailingGraphQLMutation(
    {
      ...createRemoveCacheMutation(testVars[0]),
      client,
    },
    (errors) => {
      expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
    }
  )
})

test('_removeCache (authenticated)', async () => {
  const client = createTestClient({
    service: Service.Serlo,
    user: null,
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
    user: null,
  })
  await assertFailingGraphQLMutation(
    {
      ...createUpdateCacheMutation(['I', 'will', 'fail']),
      client,
    },
    (errors) => {
      expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
    }
  )
})
