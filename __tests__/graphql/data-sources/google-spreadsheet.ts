import * as E from 'fp-ts/lib/Either'
import {
  ValueRange,
  CellValues,
  MajorDimension,
  GoogleSheetApi,
} from '../../../src/graphql/data-sources/google-spreadsheet'
import {
  createJsonResponse,
  createFetchMock,
  initializeDataSource,
} from '../../_helper'

describe('GoogleSheetApi.getValues()', () => {
  const commonUrl =
    'https://sheets.googleapis.com/v4/spreadsheets/my-spreadsheet-id' +
    '/values/sheet1!A:A?majorDimension=COLUMNS&key=my-secret'

  const commonArgs = {
    spreadsheetId: 'my-spreadsheet-id',
    range: 'sheet1!A:A',
    majorDimension: MajorDimension.Columns,
  }

  test('fetches a range of a spreadsheet', async () => {
    const fetch = createFetchMock({
      [commonUrl]: createJsonResponse({ values: [['1', '2'], ['3']] }),
    })
    const googleSheets = new GoogleSheetApi({ apiKey: 'my-secret', fetch })
    initializeDataSource(googleSheets)

    const valueRange = await googleSheets.getValues(commonArgs)

    expect(valueRange).toEqual(E.right([['1', '2'], ['3']]))
    expect(fetch).toHaveExactlyOneRequestTo(commonUrl)
  })
})

describe('ValueRange', () => {
  describe('validate values which are a valid response of the spreadsheet api', () => {
    test('matrix of cells is not empty', () => {
      const value = { values: [['1', '2'], ['3']] }

      expect(ValueRange.is(value)).toBe(true)
    })

    test('"values" property is undefined (when requested range is empty)', () => {
      expect(ValueRange.is({})).toBe(true)
    })
  })

  describe('refuse values which do not represent a valid response', () => {
    test('value is not an object', () => {
      expect(ValueRange.is(0)).toBe(false)
    })

    test('value is null', () => {
      expect(ValueRange.is(null)).toBe(false)
    })

    test('"values" property is not a matrix of cells', () => {
      expect(ValueRange.is({ values: [['1'], 1] })).toBe(false)
    })
  })
})

describe('CellValues', () => {
  describe('validates a non empty matrix of strings representing cells of a spreadsheet', () => {
    test('example with two non empty rows / columns', () => {
      expect(CellValues.is([['1', '2'], ['3']])).toBe(true)
    })

    test('a row / column is empty', () => {
      expect(CellValues.is([['1', '2'], []])).toBe(true)
    })
  })

  describe('refuses if value does not represent a cell range', () => {
    test('value is not an array', () => {
      expect(CellValues.is(0)).toBe(false)
    })

    test('outer array is empty', () => {
      expect(CellValues.is([])).toBe(false)
    })

    test('outer array contains an element which is not an array', () => {
      expect(CellValues.is([['1'], true])).toBe(false)
    })

    test('an element of an inner array is not a string', () => {
      expect(CellValues.is([['string'], [1]])).toBe(false)
    })
  })
})
