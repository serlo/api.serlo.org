import { either as E, option as O, pipeable } from 'fp-ts'
import * as t from 'io-ts'
import { nonEmptyArray } from 'io-ts-types/lib/nonEmptyArray'
import { failure } from 'io-ts/lib/PathReporter'
import * as R from 'ramda'

// TODO: review, might want to move some stuff
import { ErrorEvent } from '../error-event'
import { Environment } from '../internals/environment'
import { createQuery, FetchHelpers } from '../internals/model'

export enum MajorDimension {
  Rows = 'ROWS',
  Columns = 'COLUMNS',
}

const CellValues = nonEmptyArray(t.array(t.string))
export type CellValues = t.TypeOf<typeof CellValues>

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

interface Arguments {
  spreadsheetId: string
  range: string
  majorDimension?: MajorDimension
}

export function createGoogleSpreadsheetApiModel({
  environment,
  fetchHelpers,
}: {
  environment: Environment
  fetchHelpers: FetchHelpers
}) {
  const getValues = createQuery<Arguments, E.Either<ErrorEvent, CellValues>>(
    {
      getCurrentValue: async (args) => {
        const { spreadsheetId, range } = args
        const majorDimension = args.majorDimension ?? MajorDimension.Rows

        let result: E.Either<ErrorEvent, CellValues>

        try {
          const response = await fetchHelpers.get(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
            {
              majorDimension,
              key: process.env.GOOGLE_API_KEY,
            }
          )

          result = pipeable.pipe(
            response,
            (res) => ValueRange.decode(res),
            E.mapLeft((errors) => {
              return {
                message: `invalid response while accessing spreadsheet "${spreadsheetId}"`,
                contexts: { response, validationErrors: failure(errors) },
              }
            }),
            E.map((v) => v.values),
            E.chain(
              E.fromNullable({
                message: `range "${range}" of spreadsheet "${spreadsheetId}" is empty`,
              })
            )
          )
        } catch (error) {
          const exception =
            error instanceof Error ? error : new Error(JSON.stringify(error))

          result = E.left({
            message: `An error occurred while accessing spreadsheet "${spreadsheetId}"`,
            exception,
          })
        }

        return E.mapLeft((event: ErrorEvent) =>
          R.mergeDeepRight({ contexts: { args } }, event)
        )(result)
      },
      maxAge: { hour: 1 },
      getKey: (args) => {
        const { spreadsheetId, range } = args
        const majorDimension = args.majorDimension ?? MajorDimension.Rows
        return `spreadsheet-${spreadsheetId}-${range}-${majorDimension}`
      },
      getPayload: (key) => {
        const parts = key.split('-')
        return parts.length === 4 && parts[0] === 'spreadsheet'
          ? O.some({
              spreadsheetId: parts[1],
              range: parts[2],
              majorDimension: parts[3] as MajorDimension,
            })
          : O.none
      },
    },
    environment
  )

  return {
    getValues,
  }
}
