/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'

import { article, page, user } from '../../../__fixtures__'
import {
  createTestClient,
  Database,
  returnsUuidsFromDatabase,
  nextUuid,
  Query,
  given,
  givenUuidQueryEndpoint,
} from '../../__utils__'

let database: Database
const client = createTestClient({ userId: user.id })
const articleIds = [article.id, nextUuid(article.id)]
const mutation = new Query({
  query: gql`
    mutation uuid($input: UuidSetStateInput!) {
      uuid {
        setState(input: $input) {
          success
        }
      }
    }
  `,
  variables: { input: { id: articleIds, trashed: true } },
  client,
})

beforeEach(() => {
  database = new Database()
  database.hasUuid({ ...user, roles: ['de_architect'] })

  for (const articleId of articleIds) {
    database.hasUuid({ ...article, id: articleId })
  }

  givenUuidQueryEndpoint(returnsUuidsFromDatabase(database))
  given('UuidSetStateMutation').isDefinedBy((req, res, ctx) => {
    const { ids, trashed, userId } = req.body.payload

    // In order to test whether these parameters are passed properly
    if (userId !== user.id || trashed != true) {
      return res(ctx.status(500))
    }

    for (const id of ids) {
      database.changeUuid(id, { trashed })
    }

    return res(ctx.status(200))
  })
})

test('returns "{ success: true }" when it succeeds', async () => {
  await mutation.shouldReturnData({ uuid: { setState: { success: true } } })
})

test('updates the cache when it succeeds', async () => {
  const uuidQuery = new Query({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          trashed
        }
      }
    `,
    variables: { id: article.id },
    client,
  })
  await uuidQuery.shouldReturnData({ uuid: { trashed: false } })

  await mutation.execute()

  await uuidQuery.shouldReturnData({ uuid: { trashed: true } })
})

test('fails when database layer returns a BadRequest response', async () => {
  given('UuidSetStateMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when user is not authenticated', async () => {
  await mutation
    .withUnauthenticatedUser()
    .shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have sufficient permissions', async () => {
  // Architects are not allowed to set the state of pages.
  database.hasUuid(page)

  await mutation
    .withVariables({ input: { id: [page.id], trashed: false } })
    .shouldFailWithError('FORBIDDEN')
})

test('fails when database layer has an internal server error', async () => {
  given('UuidSetStateMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
