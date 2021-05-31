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
} from '../../../__fixtures__'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
  createTestClient,
  givenUuidQueryEndpoint,
  givenEntityCheckoutRevisionEndpoint,
  hasInternalServerError,
  Client,
  returnsJson,
  Database,
  returnsUuidsFromDatabase,
} from '../../__utils__'
import { Model } from '~/internals/graphql'

let database: Database

let client: Client
const user = { ...baseUser, roles: ['de_reviewer'] }
const article = {
  ...baseArticle,
  instance: Instance.De,
  currentRevision: articleRevision.id,
}
const unrevisedRevision = { ...articleRevision, id: articleRevision.id + 1 }

beforeEach(() => {
  client = createTestClient({ userId: user.id })

  database = new Database()
  database.hasUuids([user, article, articleRevision, unrevisedRevision])

  givenUuidQueryEndpoint(returnsUuidsFromDatabase(database))
  givenEntityCheckoutRevisionEndpoint((req, res, ctx) => {
    const { revisionId, reason, userId } = req.body.payload

    // In order to test whether these parameters are passed properly
    if (userId !== user.id || reason !== 'given reason') {
      return res(ctx.status(500))
    }

    const revision = database.getUuid(revisionId) as Model<'AbstractRevision'>

    database.changeUuid(revision.repositoryId, {
      currentRevisionId: revisionId,
    })

    return res(ctx.json({ success: true }))
  })
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  await assertSuccessfulGraphQLMutation({
    ...createCheckoutRevisionMutation(),
    data: { entity: { checkoutRevision: { success: true } } },
    client,
  })
})

test('following queries for entity point to checkout revision when entity is already in the cache', async () => {
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          ... on Article {
            currentRevision {
              id
            }
          }
        }
      }
    `,
    variables: { id: article.id },
    data: { uuid: { currentRevision: { id: articleRevision.id } } },
    client,
  })

  await assertSuccessfulGraphQLMutation({
    ...createCheckoutRevisionMutation(),
    client,
  })

  await assertSuccessfulGraphQLQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          ... on Article {
            currentRevision {
              id
            }
          }
        }
      }
    `,
    variables: { id: article.id },
    data: { uuid: { currentRevision: { id: unrevisedRevision.id } } },
    client,
  })
})

test('fails when user is not authenticated', async () => {
  const client = createTestClient({ userId: null })

  await assertFailingGraphQLMutation({
    ...createCheckoutRevisionMutation(),
    client,
    expectedError: 'UNAUTHENTICATED',
  })
})

test('fails when user does not have role "reviewer"', async () => {
  database.hasUuid({ ...user, roles: ['login', 'de_moderator'] })

  await assertFailingGraphQLMutation({
    ...createCheckoutRevisionMutation(),
    client,
    expectedError: 'FORBIDDEN',
  })
})

test('fails when database layer returns a 400er response', async () => {
  givenEntityCheckoutRevisionEndpoint(
    returnsJson({
      status: 400,
      json: { success: false, reason: 'revision is already checked out' },
    })
  )

  await assertFailingGraphQLMutation({
    ...createCheckoutRevisionMutation({ revisionId: articleRevision.id }),
    client,
    expectedError: 'BAD_USER_INPUT',
    message: 'revision is already checked out',
  })
})

test('fails when database layer has an internal error', async () => {
  givenEntityCheckoutRevisionEndpoint(hasInternalServerError())

  await assertFailingGraphQLMutation({
    ...createCheckoutRevisionMutation(),
    client,
    expectedError: 'INTERNAL_SERVER_ERROR',
  })
})

function createCheckoutRevisionMutation(args?: { revisionId: number }) {
  return {
    mutation: gql`
      mutation ($input: CheckoutRevisionInput!) {
        entity {
          checkoutRevision(input: $input) {
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
