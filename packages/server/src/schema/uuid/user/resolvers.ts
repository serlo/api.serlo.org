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
import { array as A, either as E } from 'fp-ts'
import * as F from 'fp-ts/lib/function'
import R from 'ramda'

import {
  addContext,
  assertAll,
  consumeErrorEvent,
  ErrorEvent,
} from '~/internals/error-event'
import { Context, Model, Queries, TypeResolvers } from '~/internals/graphql'
import { DiscriminatorType } from '~/model/decoder'
import { CellValues, MajorDimension } from '~/model/google-spreadsheet-api'
import { resolveScopedRoles } from '~/schema/authorization/utils'
import { ConnectionPayload } from '~/schema/connection/types'
import { resolveConnection } from '~/schema/connection/utils'
import { resolveEvents } from '~/schema/notification/resolvers'
import { createThreadResolvers } from '~/schema/thread/utils'
import { createUuidResolvers } from '~/schema/uuid/abstract-uuid/utils'
import { User } from '~/types'

export const resolvers: Queries<
  'activeAuthors' | 'activeReviewers' | 'activeDonors'
> &
  TypeResolvers<User> = {
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
    ...createThreadResolvers(),
    eventsByUser(user, payload, { dataSources }) {
      return resolveEvents({
        payload: { ...payload, actorId: user.id },
        dataSources,
      })
    },
    async activeAuthor(user, _args, { dataSources }) {
      throw new Error('simulate error here')
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
    roles(user, payload) {
      return resolveConnection({
        nodes: resolveScopedRoles(user),
        payload,
        createCursor(node) {
          return node.scope + node.role
        },
      })
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
    ids.map(async (id) => context.dataSources.model.serlo.getUuid({ id }))
  )
  const users = assertAll({
    assertion(uuid: Model<'AbstractUuid'> | null): uuid is Model<'User'> {
      return uuid !== null && uuid.__typename == DiscriminatorType.User
    },
    error: new Error('Invalid user found'),
  })(uuids)

  return resolveConnection({
    nodes: users,
    payload,
    createCursor(node) {
      return node.id.toString()
    },
  })
}

async function activeDonorIDs({ dataSources }: Context) {
  return F.pipe(
    await dataSources.model.googleSpreadsheetApi.getValues({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_API_ACTIVE_DONORS,
      range: 'Tabellenblatt1!A:A',
      majorDimension: MajorDimension.Columns,
    }),
    extractIDsFromFirstColumn
  )
}

function extractIDsFromFirstColumn(
  columns: E.Either<ErrorEvent, CellValues>
): number[] {
  return F.pipe(
    columns,
    E.map((columns) => R.head(columns)),
    E.chain(
      E.fromNullable<ErrorEvent>({
        error: new Error('no columns in selected range'),
      })
    ),
    E.map((rows) => rows.slice(1).map(R.trim)),
    E.map(
      assertAll({
        assertion: (entry) => /^\d+$/.test(entry),
        error: new Error('invalid entry in activeDonorSpreadsheet'),
      })
    ),
    E.map(A.map((entry) => Number(entry))),
    E.mapLeft(addContext({ location: 'activeDonorSpreadsheet' })),
    E.getOrElse(consumeErrorEvent([] as number[]))
  )
}
