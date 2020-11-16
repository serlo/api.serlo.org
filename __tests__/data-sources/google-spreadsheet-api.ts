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
import { InMemoryLRUCache } from 'apollo-server-caching'
import { either as E } from 'fp-ts'

import { createInMemoryCache } from '../../src/cache'
import {
  GoogleSheetApi,
  MajorDimension,
} from '../../src/graphql/data-sources/google-spreadsheet-api'
import { createTimer } from '../../src/graphql/environment'
import { expectToBeLeftEventWith, createSpreadsheetHandler } from '../__utils__'

const cache = createInMemoryCache()
const apiKey = 'my-secret'
const common = {
  spreadsheetId: 'my-spreadsheet-id',
  range: 'sheet1!A:A',
  majorDimension: MajorDimension.Columns,
  apiKey,
}
let googleSheetApi!: GoogleSheetApi

beforeEach(async () => {
  googleSheetApi = new GoogleSheetApi({
    apiKey,
    environment: { cache, timer: createTimer() },
  })
  googleSheetApi.initialize({ context: {}, cache: new InMemoryLRUCache() })

  await cache.flush()
})

describe('GoogleSheetApi.getValues()', () => {
  test('fetches a range of a spreadsheet', async () => {
    mockSpreadsheet({ ...common, values: [['1', '2'], ['3']] })

    const valueRange = await googleSheetApi.getValues(common)

    expect(valueRange).toEqual(E.right([['1', '2'], ['3']]))
  })

  test('uses a cache', async () => {
    mockSpreadsheet({ ...common, values: [['1', '2'], ['3']] })
    await googleSheetApi.getValues(common)
    mockSpreadsheet({ ...common, values: [] })

    const valueRange = await googleSheetApi.getValues(common)

    expect(valueRange).toEqual(E.right([['1', '2'], ['3']]))
  })

  test('argument "majorDimension" is optional', async () => {
    mockSpreadsheet({ ...common, majorDimension: 'ROWS', values: [['1']] })

    const valueRange = await googleSheetApi.getValues({
      spreadsheetId: common.spreadsheetId,
      range: common.range,
    })

    expect(valueRange).toEqual(E.right([['1']]))
  })

  describe('returns an error', () => {
    test('when there is an error with the api call', async () => {
      global.server.use(createSpreadsheetHandler({ ...common, status: 403 }))

      const valueRange = await googleSheetApi.getValues(common)

      expectToBeLeftEventWith(valueRange, {
        message:
          'an error occured while accessing spreadsheet "my-spreadsheet-id"',
        contexts: { args: common },
        exception: expect.any(Error) as Error,
      })
    })

    test('when value range is empty', async () => {
      global.server.use(
        createSpreadsheetHandler({
          ...common,
          body: {
            majorDimension: common.majorDimension,
            range: common.range,
          },
        })
      )

      const valueRange = await googleSheetApi.getValues(common)

      expectToBeLeftEventWith(valueRange, {
        message:
          'range "sheet1!A:A" of spreadsheet "my-spreadsheet-id" is empty',
        contexts: { args: common },
      })
    })

    describe('when server response is no valid value range', () => {
      test.each([{ values: [['1'], 1] }, { error: 'an error' }])(
        'response = %p',
        async (response) => {
          global.server.use(
            createSpreadsheetHandler({ ...common, body: response })
          )

          const valueRange = await googleSheetApi.getValues(common)

          expectToBeLeftEventWith(valueRange, {
            message:
              'invalid response while accessing spreadsheet "my-spreadsheet-id"',
            contexts: {
              args: common,
              response,
              validationErrors: expect.any(Array) as unknown,
            },
          })
        }
      )
    })
  })
})

function mockSpreadsheet({
  spreadsheetId,
  range,
  majorDimension,
  values,
}: {
  spreadsheetId: string
  range: string
  majorDimension: string
  values: string[][]
}) {
  global.server.use(
    createSpreadsheetHandler({
      spreadsheetId,
      range,
      majorDimension,
      apiKey,
      body: {
        range,
        majorDimension,
        values,
      },
    })
  )
}
