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
import { Instance } from '@serlo/api'
import { gql } from 'apollo-server'

import {
  article as baseArticle,
  articleRevision,
  user as baseUser,
  video,
} from '../../../__fixtures__'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
  createTestClient,
  givenUuidQueryEndpoint,
  givenEntityRejectRevisionEndpoint,
  hasInternalServerError,
  Client,
  returnsJson,
  Database,
  returnsUuidsFromDatabase,
} from '../../__utils__'

let database: Database

let client: Client
const user = { ...baseUser, roles: ['de_reviewer'] }
const article = {
  ...baseArticle,
  instance: Instance.De,
  currentRevision: articleRevision.id,
}
const unrevisedRevision = {
  ...articleRevision,
  id: articleRevision.id + 1,
  trashed: false,
}

beforeEach(() => {
  client = createTestClient({ userId: user.id })

  database = new Database()
  database.hasUuids([user, article, articleRevision, unrevisedRevision])

  givenUuidQueryEndpoint(returnsUuidsFromDatabase(database))
  givenEntityRejectRevisionEndpoint((req, res, ctx) => {
    const { revisionId, reason, userId } = req.body.payload

    // In order to test whether these parameters are passed properly
    if (userId !== user.id || reason !== 'given reason') {
      return res(ctx.status(500))
    }

    database.changeUuid(revisionId, {
      trashed: true,
    })

    return res(ctx.json({ success: true }))
  })
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  await assertSuccessfulGraphQLMutation({
    ...createRejectRevisionMutation(),
    data: { entity: { rejectRevision: { success: true } } },
    client,
  })
})

test('following queries for entity point to checkout revision when entity is already in the cache', async () => {
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          trashed
        }
      }
    `,
    variables: { id: unrevisedRevision.id },
    data: { uuid: { trashed: false } },
    client,
  })

  await assertSuccessfulGraphQLMutation({
    ...createRejectRevisionMutation(),
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
    variables: { id: unrevisedRevision.id },
    data: { uuid: { trashed: true } },
    client,
  })
})

test('fails when user is not authenticated', async () => {
  const client = createTestClient({ userId: null })

  await assertFailingGraphQLMutation({
    ...createRejectRevisionMutation(),
    client,
    expectedError: 'UNAUTHENTICATED',
  })
})

test('fails when user does not have role "reviewer"', async () => {
  database.hasUuid({ ...user, roles: ['login', 'de_moderator'] })

  await assertFailingGraphQLMutation({
    ...createRejectRevisionMutation(),
    client,
    expectedError: 'FORBIDDEN',
  })
})

test('fails when revisionId does not belong to a revision', async () => {
  database.hasUuid(video)

  await assertFailingGraphQLMutation({
    ...createRejectRevisionMutation({ revisionId: video.id }),
    client,
    expectedError: 'BAD_USER_INPUT',
  })
})

test('fails when database layer returns a 400er response', async () => {
  givenEntityRejectRevisionEndpoint(
    returnsJson({
      status: 400,
      json: { success: false, reason: 'revision cannot be rejected' },
    })
  )

  await assertFailingGraphQLMutation({
    ...createRejectRevisionMutation({ revisionId: articleRevision.id }),
    client,
    expectedError: 'BAD_USER_INPUT',
    message: 'revision cannot be rejected',
  })
})

test('fails when database layer has an internal error', async () => {
  givenEntityRejectRevisionEndpoint(hasInternalServerError())

  await assertFailingGraphQLMutation({
    ...createRejectRevisionMutation(),
    client,
    expectedError: 'INTERNAL_SERVER_ERROR',
  })
})

function createRejectRevisionMutation(args?: { revisionId: number }) {
  return {
    mutation: gql`
      mutation ($input: RejectRevisionInput!) {
        entity {
          rejectRevision(input: $input) {
            success
          }
        }
      }
    `,
    variables: {
      input: {
        revisionId: args?.revisionId ?? unrevisedRevision.id,
        reason: 'given reason',
      },
    },
  }
}
