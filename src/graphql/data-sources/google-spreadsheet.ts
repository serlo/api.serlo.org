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
import { RESTDataSource } from 'apollo-datasource-rest'
import { fetch as fetchApollo } from 'apollo-server-env'
import { either, pipeable } from 'fp-ts'
import * as t from 'io-ts'
import { nonEmptyArray } from 'io-ts-types/lib/nonEmptyArray'
import { failure } from 'io-ts/lib/PathReporter'
import fetchNode from 'node-fetch'
import * as R from 'ramda'

import { ErrorEvent } from '../../error-event'

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
const { decode } = ValueRange

export class GoogleSheetApi extends RESTDataSource {
  private apiKey: string

  constructor({
    apiKey,
    fetch,
  }: {
    apiKey: string
    fetch: typeof fetchNode
  }) {
    super(fetch as typeof fetchApollo)

    this.apiKey = apiKey
    this.baseURL = 'https://sheets.googleapis.com/v4/spreadsheets/'
  }

  async getValues(args: {
    spreadsheetId: string
    range: string
    majorDimension?: MajorDimension
  }): Promise<either.Either<ErrorEvent, CellValues>> {
    const { spreadsheetId, range } = args
    const majorDimension = args.majorDimension ?? MajorDimension.Rows
    let result: either.Either<ErrorEvent, CellValues>

    try {
      const response = (await this.get(`${spreadsheetId}/values/${range}`, {
        majorDimension,
        key: this.apiKey,
      })) as unknown

      result = pipeable.pipe(
        response,
        decode,
        either.mapLeft((errors) => {
          return {
            message: `invalid response while accessing spreadsheet "${spreadsheetId}"`,
            contexts: { response, validationErrors: failure(errors) },
          }
        }),
        either.map((v) => v.values),
        either.chain(
          either.fromNullable({
            message: `range "${range}" of spreadsheet "${spreadsheetId}" is empty`,
          })
        )
      )
    } catch (error) {
      const exception =
        error instanceof Error ? error : new Error(JSON.stringify(error))

      result = either.left({
        message: `an error occured while accessing spreadsheet "${spreadsheetId}"`,
        exception,
      })
    }

    return either.mapLeft((event: ErrorEvent) =>
      R.mergeDeepRight({ contexts: { args } }, event)
    )(result)
  }
}
