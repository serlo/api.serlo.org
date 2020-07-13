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
import { either } from 'fp-ts'

import {
  ActiveDonorsSpreadsheet,
  extractUserIds,
} from '../../../src/graphql/data-sources/active-donors-spreadsheet'
import { MajorDimension } from '../../../src/graphql/data-sources/google-spreadsheet'

describe('ActiveDonorsSpreadsheet', () => {
  const googleSheetApi = { getValues: jest.fn(), initialize: jest.fn() }
  const donorsSheet = new ActiveDonorsSpreadsheet(
    googleSheetApi,
    'active-donors',
    'sheet1'
  )

  describe('getActiveDonorIds()', () => {
    test('returns user ids from spreadsheet with active donors', async () => {
      googleSheetApi.getValues.mockResolvedValueOnce(
        either.right([['Header', '1', '2']])
      )

      const ids = await donorsSheet.getActiveDonorIds()

      expect(ids).toEqual([1, 2])
      expect(googleSheetApi.getValues).toHaveBeenCalledWith({
        spreadsheetId: 'active-donors',
        range: 'sheet1!A:A',
        majorDimension: MajorDimension.Columns,
      })
    })

    test('returns empty list when an error occured', async () => {
      googleSheetApi.getValues.mockResolvedValueOnce(either.left({}))

      expect(await donorsSheet.getActiveDonorIds()).toEqual([])
    })
  })
})

describe('extractUserIds()', () => {
  test('extract user ids from first column', () => {
    expect(extractUserIds([['Header', '1', '2', '3']])).toEqual([1, 2, 3])
  })

  test('removes entries which are no valid uuids', () => {
    const ids = extractUserIds([['Header', '23', 'foo', '-1', '', '1.5']])

    expect(ids).toEqual([23])
  })

  test('cell entries are trimmed of leading and trailing whitespaces', () => {
    expect(extractUserIds([['Header', '  10  ', '   20']])).toEqual([10, 20])
  })

  test('returns empty list when an empty range is given', () => {
    expect(extractUserIds([[]])).toEqual([])
  })
})
