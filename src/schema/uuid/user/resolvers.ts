/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { either as E, pipeable } from 'fp-ts'

import { CellValues, MajorDimension } from '../../../model'
import { ConnectionPayload, resolveConnection } from '../../connection'
import { createUuidResolvers } from '../abstract-uuid'
import { isUserPayload, UserPayload, UserResolvers } from './types'
import { ErrorEvent } from '~/internals/error-event'
import { Context } from '~/internals/graphql'

export const resolvers: UserResolvers = {
  Query: {
    async activeAuthors(_parent, payload, context) {
      return resolveUserConnectionFromIds({
        ids: await context.dataSources.model.serlo.getActiveAuthorIds(),
        payload,
        context,
      })
    },
    async activeDonors(_parent, payload, context) {
      return resolveUserConnectionFromIds({
        ids: await activeDonorIDs(context),
        payload,
        context,
      })
    },
    async activeReviewers(_parent, payload, context) {
      return resolveUserConnectionFromIds({
        ids: await context.dataSources.model.serlo.getActiveReviewerIds(),
        payload,
        context,
      })
    },
  },
  User: {
    ...createUuidResolvers(),
    async activeAuthor(user, _args, { dataSources }) {
      return (await dataSources.model.serlo.getActiveAuthorIds()).includes(
        user.id
      )
    },
    async activeDonor(user, _args, context) {
      const ids = await activeDonorIDs(context)

      return ids.includes(user.id)
    },
    async activeReviewer(user, _args, { dataSources }) {
      return (await dataSources.model.serlo.getActiveReviewerIds()).includes(
        user.id
      )
    },
  },
}

async function resolveUserConnectionFromIds({
  ids,
  payload,
  context,
}: {
  ids: number[]
  payload: ConnectionPayload
  context: Context
}) {
  const uuids = await Promise.all(
    ids.map((id) => context.dataSources.model.serlo.getUuid({ id }))
  )
  return resolveConnection<UserPayload>({
    // TODO: Report uuids which are not users to sentry
    nodes: uuids.filter(isUserPayload),
    payload,
    createCursor(node) {
      return node.id.toString()
    },
  })
}

async function activeDonorIDs({ dataSources }: Context) {
  return pipeable.pipe(
    await dataSources.model.googleSpreadsheetApi.getValues({
      spreadsheetId: process.env.ACTIVE_DONORS_SPREADSHEET_ID,
      range: 'Tabellenblatt1!A:A',
      majorDimension: MajorDimension.Columns,
    }),
    extractIDsFromFirstColumn
  )
}

function extractIDsFromFirstColumn(
  cells: E.Either<ErrorEvent, CellValues>
): number[] {
  return pipeable.pipe(
    cells,
    E.map((cells) =>
      cells[0]
        .slice(1)
        .map((c) => c.trim())
        // TODO: Report those invalid values to sentry
        .filter((x) => /^\d+$/.test(x))
        .map((x) => Number(x))
    ),
    // TODO: Report error to sentry
    E.getOrElse<ErrorEvent, number[]>(() => [])
  )
}
