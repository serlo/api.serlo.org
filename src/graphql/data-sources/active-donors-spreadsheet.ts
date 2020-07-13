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
import { DataSource, DataSourceConfig } from 'apollo-datasource'
import { pipeable, either } from 'fp-ts'

import { ErrorEvent } from '../../error-event'
import { Context } from '../schema/types'
import {
  CellValues,
  MajorDimension,
  GoogleSheetApi,
} from './google-spreadsheet'

export class ActiveDonorsSpreadsheet extends DataSource<Context> {
  constructor(
    private googleSheetApi: Pick<GoogleSheetApi, 'getValues' | 'initialize'>,
    private spreadsheetId: string,
    private tableName: string
  ) {
    super()
  }

  initialize(config: DataSourceConfig<Context>) {
    this.googleSheetApi.initialize?.(config)
  }

  async getActiveDonorIds(): Promise<number[]> {
    return pipeable.pipe(
      await this.googleSheetApi.getValues({
        spreadsheetId: this.spreadsheetId,
        range: `${this.tableName}!A:A`,
        majorDimension: MajorDimension.Columns,
      }),
      either.map(extractUserIds),
      // TODO: Report error to sentry
      either.getOrElse<ErrorEvent, number[]>((_) => [])
    )
  }
}

export function extractUserIds(cells: CellValues): number[] {
  return (
    cells[0]
      .slice(1)
      .map((c) => c.trim())
      // TODO: Report those invalid values to sentry
      .filter((x) => /^\d+$/.test(x))
      .map((x) => Number(x))
  )
}
