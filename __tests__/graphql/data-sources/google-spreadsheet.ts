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
import { either, option } from 'fp-ts'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { createInMemoryCache } from '../../../src/cache/in-memory-cache'
import {
  MajorDimension,
  GoogleSheetApi,
} from '../../../src/graphql/data-sources/google-spreadsheet'
import { initializeDataSource, expectToBeLeftEventWith } from '../../_helper'

const server = setupServer()
const cache = createInMemoryCache()
const environment = { cache }
const apiKey = 'my-secret'
const common = {
  apiKey: 'my-secret',
  spreadsheetId: 'my-spreadsheet-id',
  range: 'sheet1!A:A',
  majorDimension: MajorDimension.Columns,
}

beforeAll(() => {
  server.listen()
})

afterEach(async () => {
  server.resetHandlers()
  await cache.flush()
})

afterAll(() => {
  server.close()
})

describe('GoogleSheetApi.getValues()', () => {
  test('fetches a range of a spreadsheet', async () => {
    mockSpreadsheet({ ...common, values: [['1', '2'], ['3']] })

    const googleSheets = new GoogleSheetApi({ apiKey, environment })
    initializeDataSource(googleSheets)

    const valueRange = await googleSheets.getValues(common)

    expect(valueRange).toEqual(either.right([['1', '2'], ['3']]))
  })

  describe('uses a cache', () => {
    test('results are cached for an hour', async () => {
      const cacheKey = 'spreadsheet-my-spreadsheet-id-sheet1!A:A-COLUMNS'
      await cache.set(cacheKey, [['1', '2']])

      const googleSheets = new GoogleSheetApi({ apiKey, environment })
      initializeDataSource(googleSheets)

      const valueRange = await googleSheets.getValues(common)

      expect(valueRange).toEqual(either.right([['1', '2']]))
    })

    test('results are cached for an hour', async () => {
      mockSpreadsheet({ ...common, values: [['1', '2'], ['3']] })

      const googleSheets = new GoogleSheetApi({ apiKey, environment })
      initializeDataSource(googleSheets)

      await googleSheets.getValues(common)

      expect(
        await cache.get('spreadsheet-my-spreadsheet-id-sheet1!A:A-COLUMNS')
      ).toEqual(option.some([['1', '2'], ['3']]))
    })
  })

  test('argument "majorDimension" is optional', async () => {
    mockSpreadsheet({ ...common, majorDimension: 'ROWS', values: [['1']] })

    const googleSheets = new GoogleSheetApi({ apiKey, environment })
    initializeDataSource(googleSheets)

    const valueRange = await googleSheets.getValues({
      spreadsheetId: common.spreadsheetId,
      range: common.range,
    })

    expect(valueRange).toEqual(either.right([['1']]))
  })

  describe('returns an error', () => {
    test('when there is an error with the api call', async () => {
      mockSpreadsheetResponse({ ...common, status: 403 })

      const googleSheets = new GoogleSheetApi({ apiKey, environment })
      initializeDataSource(googleSheets)

      const valueRange = await googleSheets.getValues(common)

      expectToBeLeftEventWith(valueRange, {
        message:
          'an error occured while accessing spreadsheet "my-spreadsheet-id"',
        contexts: { args: common },
        exception: expect.any(Error) as Error,
      })
    })

    test('when value range is empty', async () => {
      mockSpreadsheetResponse({
        ...common,
        response: {
          majorDimension: common.majorDimension,
          range: common.range,
        },
      })

      const googleSheets = new GoogleSheetApi({ apiKey, environment })
      initializeDataSource(googleSheets)

      const valueRange = await googleSheets.getValues(common)

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
          mockSpreadsheetResponse({ ...common, response })

          const googleSheets = new GoogleSheetApi({ apiKey, environment })
          initializeDataSource(googleSheets)

          const valueRange = await googleSheets.getValues(common)

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
  apiKey,
  spreadsheetId,
  range,
  majorDimension,
  values,
}: {
  apiKey: string
  spreadsheetId: string
  range: string
  majorDimension: string
  values: string[][]
}) {
  mockSpreadsheetResponse({
    apiKey,
    spreadsheetId,
    range,
    majorDimension,
    response: {
      range,
      majorDimension,
      values,
    },
  })
}

function mockSpreadsheetResponse({
  apiKey,
  spreadsheetId,
  range,
  majorDimension,
  status = 200,
  response = {},
}: {
  apiKey: string
  spreadsheetId: string
  range: string
  majorDimension: string
  status?: number
  response?: object
}) {
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}` +
    `/values/${range}?majorDimension=${majorDimension}&key=${apiKey}`

  server.use(
    rest.get(url, (_req, res, ctx) =>
      res.once(ctx.status(status), ctx.json(response))
    )
  )
}
