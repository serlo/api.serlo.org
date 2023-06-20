import { either as E, option as O, function as F } from 'fp-ts'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as t from 'io-ts'
import { formatValidationErrors } from 'io-ts-reporters'
import { nonEmptyArray } from 'io-ts-types/lib/nonEmptyArray'
import { URL } from 'url'

import { createQuery } from '~/internals/data-source-helper'
import { Environment } from '~/internals/environment'
import { addContext, ErrorEvent } from '~/internals/error-event'

export enum MajorDimension {
  Rows = 'ROWS',
  Columns = 'COLUMNS',
}

const CellValues = nonEmptyArray(t.array(t.string))
// Syntax manually de-sugared because API Exporter doesn't support import() types yet
// export type CellValues = t.TypeOf<typeof CellValues>
export type CellValues = NonEmptyArray<string[]>

const ValueRange = t.intersection([
  t.partial({
    values: CellValues,
  }),
  t.type({
    range: t.string,
    majorDimension: t.string,
  }),
])
type ValueRange = t.TypeOf<typeof ValueRange>

export interface Arguments {
  spreadsheetId: string
  range: string
  majorDimension?: MajorDimension
}

export function createGoogleSpreadsheetApiModel({
  environment,
}: {
  environment: Environment
}) {
  const getValues = createQuery<Arguments, E.Either<ErrorEvent, CellValues>>(
    {
      enableSwr: true,
      getCurrentValue: async (args) => {
        const { spreadsheetId, range } = args
        const majorDimension = args.majorDimension ?? MajorDimension.Rows
        const url = new URL(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`
        )
        url.searchParams.append('majorDimension', majorDimension)
        const apiSecret = process.env.GOOGLE_SPREADSHEET_API_SECRET
        url.searchParams.append('key', apiSecret)

        const specifyErrorLocation = E.mapLeft(
          addContext({
            location: 'googleSpreadSheetApi',
            locationContext: { ...args },
          })
        )

        try {
          const response = await fetch(url.toString())

          return F.pipe(
            ValueRange.decode(await response.json()),
            E.mapLeft((errors) => {
              return {
                error: new Error('invalid response'),
                errorContext: {
                  validationErrors: formatValidationErrors(errors),
                },
              }
            }),
            E.map((v) => v.values),
            E.chain(E.fromNullable({ error: new Error('range is empty') })),
            specifyErrorLocation
          )
        } catch (error) {
          return specifyErrorLocation(E.left({ error: E.toError(error) }))
        }
      },
      staleAfter: { hour: 1 },
      getKey: (args) => {
        const { spreadsheetId, range } = args
        const majorDimension = args.majorDimension ?? MajorDimension.Rows
        return `spreadsheet/${spreadsheetId}/${range}/${majorDimension}`
      },
      getPayload: (key) => {
        const parts = key.split('/')
        return parts.length === 4 && parts[0] === 'spreadsheet'
          ? O.some({
              spreadsheetId: parts[1],
              range: parts[2],
              majorDimension: parts[3] as MajorDimension,
            })
          : O.none
      },
      examplePayload: {
        spreadsheetId: 'abc',
        range: 'Tabellenblatt1!A:F',
        majorDimension: MajorDimension.Rows,
      },
    },
    environment
  )

  return {
    getValues,
  }
}
