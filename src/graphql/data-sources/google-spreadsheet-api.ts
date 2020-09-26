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

import { either, option, pipeable } from 'fp-ts'
import * as t from 'io-ts'
import { nonEmptyArray } from 'io-ts-types/lib/nonEmptyArray'
import { failure } from 'io-ts/lib/PathReporter'
import * as R from 'ramda'

import { ErrorEvent } from '../../error-event'
import { Environment } from '../environment'
import { CacheableDataSource } from './cacheable-data-source'

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

export class GoogleSheetApi extends CacheableDataSource {
  private apiKey: string
  private environment: Environment

  public async updateCache(key: string) {
    const sslen = 'spreadsheet-'.length
    const googleIdLength = 44
    const spreadsheetId = key.slice(sslen, sslen + googleIdLength)
    const [, range, majorDimension] = key
      .slice(sslen + googleIdLength)
      .split('-')
    await this.getValues({
      spreadsheetId,
      range,
      majorDimension: majorDimension as MajorDimension,
      ignoreCache: true,
    })
  }

  constructor({
    apiKey,
    environment,
  }: {
    apiKey: string
    environment: Environment
  }) {
    super()

    this.apiKey = apiKey
    this.environment = environment
    this.baseURL = 'https://sheets.googleapis.com/v4/spreadsheets/'
  }

  async getValues(args: {
    spreadsheetId: string
    range: string
    majorDimension?: MajorDimension
    ignoreCache?: boolean
  }): Promise<either.Either<ErrorEvent, CellValues>> {
    const { spreadsheetId, range, ignoreCache } = args
    const majorDimension = args.majorDimension ?? MajorDimension.Rows
    const cacheKey = this.getCacheKey({ spreadsheetId, range, majorDimension })

    if (!ignoreCache) {
      const cachedResult = await this.environment.cache.get<CellValues>(
        cacheKey
      )
      if (option.isSome(cachedResult)) {
        return either.right(cachedResult.value)
      }
    }
    let result: either.Either<ErrorEvent, CellValues>

    try {
      const response = (await this.get(`${spreadsheetId}/values/${range}`, {
        majorDimension,
        key: this.apiKey,
      })) as unknown

      result = pipeable.pipe(
        response,
        (res) => ValueRange.decode(res),
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

      if (either.isRight(result)) {
        await this.environment.cache.set(cacheKey, result.right, {
          ttl: 60 * 60,
        })
      }
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

  private getCacheKey({
    spreadsheetId,
    range,
    majorDimension,
  }: {
    spreadsheetId: string
    range: string
    majorDimension: MajorDimension
  }): string {
    return `spreadsheet-${spreadsheetId}-${range}-${majorDimension}`
  }
}
