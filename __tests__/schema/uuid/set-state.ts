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
import { gql } from 'apollo-server'

import { article, page, user } from '../../../__fixtures__'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  createTestClient,
  givenUuidQueryEndpoint,
  Client,
  Database,
  returnsUuidsFromDatabase,
  givenSerloEndpoint,
  MessageResolver,
  assertSuccessfulGraphQLQuery,
  hasInternalServerError,
} from '../../__utils__'

let database: Database
let client: Client
const mutation = gql`
  mutation uuid($input: UuidSetStateInput!) {
    uuid {
      setState(input: $input) {
        success
      }
    }
  }
`
const articleIds = [article.id, article.id + 1]

beforeEach(() => {
  client = createTestClient({ userId: user.id })

  database = new Database()
  database.hasUuids([{ ...user, roles: ['de_architect'] }])

  for (const articleId of articleIds) {
    database.hasUuid({ ...article, id: articleId })
  }

  givenUuidQueryEndpoint(returnsUuidsFromDatabase(database))
  givenUuidSetStateMutationEndpoint((req, res, ctx) => {
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
  await assertSuccessfulGraphQLMutation({
    mutation,
    variables: { input: { id: articleIds, trashed: true } },
    data: { uuid: { setState: { success: true } } },
    client,
  })
})

test('updates the cache when it succeeds', async () => {
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          trashed
        }
      }
    `,
    variables: { id: article.id },
    data: { uuid: { trashed: false } },
    client,
  })

  await assertSuccessfulGraphQLMutation({
    mutation,
    variables: { input: { id: articleIds, trashed: true } },
    data: { uuid: { setState: { success: true } } },
    client,
  })

  await assertSuccessfulGraphQLQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          trashed
        }
      }
    `,
    variables: { id: article.id },
    data: { uuid: { trashed: true } },
    client,
  })
})

test('fails when user is not authenticated', async () => {
  await assertFailingGraphQLMutation({
    mutation,
    variables: { input: { id: articleIds, trashed: true } },
    client: createTestClient({ userId: null }),
    expectedError: 'UNAUTHENTICATED',
  })
})

test('fails when user does not have sufficient permissions', async () => {
  // Architects are not allowed to set the state of pages.
  database.hasUuid(page)
  await assertFailingGraphQLMutation({
    mutation,
    variables: { input: { id: page.id, trashed: false } },
    client,
    expectedError: 'FORBIDDEN',
  })
})

test('fails when database layer has an internal server error', async () => {
  givenUuidSetStateMutationEndpoint(hasInternalServerError())

  await assertFailingGraphQLMutation({
    mutation,
    variables: { input: { id: articleIds, trashed: true } },
    client,
    expectedError: 'INTERNAL_SERVER_ERROR',
  })
})

function givenUuidSetStateMutationEndpoint(
  resolver: MessageResolver<{
    ids: number[]
    userId: number
    trashed: boolean
  }>
) {
  givenSerloEndpoint('UuidSetStateMutation', resolver)
}
