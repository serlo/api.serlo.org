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
import { pipeable, either } from 'fp-ts'

import { AbstractUuidPayload } from '..'
import { ErrorEvent } from '../../../../error-event'
import {
  MajorDimension,
  GoogleSheetApi,
  CellValues,
} from '../../../data-sources/google-spreadsheet-api'
import { createThreadsResolver } from '../../threads'
import { UserResolvers, isUserPayload } from './types'

export const resolvers: UserResolvers = {
  Query: {
    async activeDonors(_parent, _args, { dataSources }) {
      const ids = await activeDonorIDs(dataSources.googleSheetApi)

      const uuids = await Promise.all(
        ids.map((id) => dataSources.serlo.getUuid<AbstractUuidPayload>({ id }))
      )

      // TODO: Report uuids which are not users to sentry
      return uuids.filter(isUserPayload)
    },
  },
  User: {
    async activeDonor(user, _args, { dataSources }) {
      const ids = await activeDonorIDs(dataSources.googleSheetApi)

      return ids.includes(user.id)
    },
    threads: createThreadsResolver(),
  },
}

async function activeDonorIDs(googleSheetApi: GoogleSheetApi) {
  return pipeable.pipe(
    await googleSheetApi.getValues({
      spreadsheetId: process.env.ACTIVE_DONORS_SPREADSHEET_ID,
      range: 'Tabellenblatt1!A:A',
      majorDimension: MajorDimension.Columns,
    }),
    extractIDsFromFirstColumn
  )
}

function extractIDsFromFirstColumn(
  cells: either.Either<ErrorEvent, CellValues>
): number[] {
  return pipeable.pipe(
    cells,
    either.map((cells) =>
      cells[0]
        .slice(1)
        .map((c) => c.trim())
        // TODO: Report those invalid values to sentry
        .filter((x) => /^\d+$/.test(x))
        .map((x) => Number(x))
    ),
    // TODO: Report error to sentry
    either.getOrElse<ErrorEvent, number[]>((_) => [])
  )
}
