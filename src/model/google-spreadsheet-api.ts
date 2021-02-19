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
import { either as E, option as O, pipeable } from 'fp-ts'
import * as t from 'io-ts'
import { nonEmptyArray } from 'io-ts-types/lib/nonEmptyArray'
import { failure } from 'io-ts/lib/PathReporter'
import fetch from 'node-fetch'
import { URL } from 'url'

import { Environment } from '~/internals/environment'
import { addContext, ErrorEvent } from '~/internals/error-event'
import { createQuery } from '~/internals/model'

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

          return pipeable.pipe(
            ValueRange.decode(await response.json()),
            E.mapLeft((errors) => {
              return {
                error: new Error('invalid response'),
                errorContext: { validationErrors: failure(errors) },
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
