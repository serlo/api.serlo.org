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
import { Response } from 'node-fetch'

import { createInMemoryCache } from '../../../src/cache/in-memory-cache'
import {
  MajorDimension,
  GoogleSheetApi,
} from '../../../src/graphql/data-sources/google-spreadsheet'
import {
  createJsonResponse,
  createFetchMock,
  initializeDataSource,
  expectToBeLeftEventWith,
} from '../../_helper'

describe('GoogleSheetApi.getValues()', () => {
  const url =
    'https://sheets.googleapis.com/v4/spreadsheets/my-spreadsheet-id' +
    '/values/sheet1!A:A?majorDimension=COLUMNS&key=my-secret'

  const args = {
    spreadsheetId: 'my-spreadsheet-id',
    range: 'sheet1!A:A',
    majorDimension: MajorDimension.Columns,
  }

  test('fetches a range of a spreadsheet', async () => {
    const fetch = createFetchMock({
      [url]: createJsonResponse({
        values: [['1', '2'], ['3']],
        range: 'sheet1!A:A',
        majorDimension: 'COLUMNS',
      }),
    })
    const googleSheets = new GoogleSheetApi({
      apiKey: 'my-secret',
      fetch,
      environment: { cache: createInMemoryCache() },
    })
    initializeDataSource(googleSheets)

    const valueRange = await googleSheets.getValues(args)

    expect(valueRange).toEqual(either.right([['1', '2'], ['3']]))
    expect(fetch).toHaveExactlyOneRequestTo(url)
  })

  describe('uses a cache', () => {
    test('results are cached for an hour', async () => {
      const cache = createInMemoryCache()
      const cacheKey = 'spreadsheet-my-spreadsheet-id-sheet1!A:A-COLUMNS'
      await cache.set(cacheKey, [['1', '2']])
      const googleSheets = new GoogleSheetApi({
        apiKey: 'my-secret',
        environment: { cache },
      })
      initializeDataSource(googleSheets)

      const valueRange = await googleSheets.getValues(args)

      expect(valueRange).toEqual(either.right([['1', '2']]))
    })

    test('results are cached for an hour', async () => {
      const fetch = createFetchMock({
        [url]: createJsonResponse({
          values: [['1', '2'], ['3']],
          range: 'sheet1!A:A',
          majorDimension: 'COLUMNS',
        }),
      })
      const cache = createInMemoryCache()
      const googleSheets = new GoogleSheetApi({
        apiKey: 'my-secret',
        fetch,
        environment: { cache },
      })
      initializeDataSource(googleSheets)

      await googleSheets.getValues(args)

      expect(
        await cache.get('spreadsheet-my-spreadsheet-id-sheet1!A:A-COLUMNS')
      ).toEqual(option.some([['1', '2'], ['3']]))
    })
  })

  test('argument "majorDimension" is optional', async () => {
    const url =
      'https://sheets.googleapis.com/v4/spreadsheets/my-spreadsheet-id' +
      '/values/sheet1!A:A?majorDimension=ROWS&key=my-secret'
    const fetch = createFetchMock({
      [url]: createJsonResponse({
        values: [['1', '2'], ['3']],
        range: 'sheet1!A:A',
        majorDimension: 'ROWS',
      }),
    })
    const googleSheets = new GoogleSheetApi({
      apiKey: 'my-secret',
      fetch,
      environment: { cache: createInMemoryCache() },
    })
    initializeDataSource(googleSheets)

    const valueRange = await googleSheets.getValues({
      spreadsheetId: args.spreadsheetId,
      range: args.range,
    })

    expect(valueRange).toEqual(either.right([['1', '2'], ['3']]))
  })

  describe('returns an error', () => {
    test('when there is an error with the api call', async () => {
      const fetch = createFetchMock({
        [url]: new Response('', { status: 403 }),
      })
      const googleSheets = new GoogleSheetApi({
        apiKey: 'my-secret',
        fetch,
        environment: { cache: createInMemoryCache() },
      })
      initializeDataSource(googleSheets)

      const valueRange = await googleSheets.getValues(args)

      expectToBeLeftEventWith(valueRange, {
        message:
          'an error occured while accessing spreadsheet "my-spreadsheet-id"',
        contexts: { args: args },
        exception: expect.any(Error) as Error,
      })
    })

    test('when value range is empty', async () => {
      const fetch = createFetchMock({
        [url]: createJsonResponse({
          range: 'sheet1!A:A',
          majorDimension: 'COLUMNS',
        }),
      })
      const googleSheets = new GoogleSheetApi({
        apiKey: 'my-secret',
        fetch,
        environment: { cache: createInMemoryCache() },
      })
      initializeDataSource(googleSheets)

      const valueRange = await googleSheets.getValues(args)

      expectToBeLeftEventWith(valueRange, {
        message:
          'range "sheet1!A:A" of spreadsheet "my-spreadsheet-id" is empty',
        contexts: { args: args },
      })
    })

    describe('when server response is no valid value range', () => {
      test.each([null, { values: [['1'], 1] }, { error: 'an error' }])(
        'response = %p',
        async (response) => {
          const fetch = createFetchMock({
            [url]: createJsonResponse(response),
          })
          const googleSheets = new GoogleSheetApi({
            apiKey: 'my-secret',
            fetch,
            environment: { cache: createInMemoryCache() },
          })
          initializeDataSource(googleSheets)

          const valueRange = await googleSheets.getValues(args)

          expectToBeLeftEventWith(valueRange, {
            message:
              'invalid response while accessing spreadsheet "my-spreadsheet-id"',
            contexts: {
              args,
              response,
              validationErrors: expect.any(Array) as unknown,
            },
          })
        }
      )
    })
  })
})
