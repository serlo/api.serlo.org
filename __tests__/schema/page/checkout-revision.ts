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
  page as basePage,
  pageRevision,
  user as baseUser,
} from '../../../__fixtures__'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
  Client,
  createTestClient,
  Database,
  givenPageCheckoutRevisionEndpoint,
  givenUuidQueryEndpoint,
  hasInternalServerError,
  nextUuid,
  returnsJson,
  returnsUuidsFromDatabase,
} from '../../__utils__'
import { Model } from '~/internals/graphql'

let database: Database

let client: Client
const user = { ...baseUser, roles: ['de_static_pages_builder'] }
const page = {
  ...basePage,
  instance: Instance.De,
  currentRevision: pageRevision.id,
}
const unrevisedRevision = {
  ...pageRevision,
  id: nextUuid(pageRevision.id),
  trashed: true,
}

beforeEach(() => {
  client = createTestClient({ userId: user.id })

  database = new Database()
  database.hasUuids([user, page, pageRevision, unrevisedRevision])

  givenUuidQueryEndpoint(returnsUuidsFromDatabase(database))
  givenPageCheckoutRevisionEndpoint((req, res, ctx) => {
    const { revisionId, reason, userId } = req.body.payload

    // In order to test whether these parameters are passed properly
    if (userId !== user.id || reason !== 'given reason') {
      return res(ctx.status(500))
    }

    const revision = database.getUuid(revisionId) as Model<'PageRevision'>

    database.changeUuid(revision.repositoryId, {
      currentRevisionId: revisionId,
    })
    database.changeUuid(revisionId, { trashed: false })

    return res(ctx.json({ success: true }))
  })
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  await assertSuccessfulGraphQLMutation({
    ...createCheckoutRevisionMutation(),
    data: { page: { checkoutRevision: { success: true } } },
    client,
  })
})

test('following queries for page point to checkout revision when page is already in the cache', async () => {
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          ... on Page {
            currentRevision {
              id
            }
          }
        }
      }
    `,
    variables: { id: page.id },
    data: { uuid: { currentRevision: { id: pageRevision.id } } },
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
          ... on Page {
            currentRevision {
              id
            }
          }
        }
      }
    `,
    variables: { id: page.id },
    data: { uuid: { currentRevision: { id: unrevisedRevision.id } } },
    client,
  })
})

test('checkout revision has trashed == false for following queries', async () => {
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          ... on PageRevision {
            trashed
          }
        }
      }
    `,
    variables: { id: unrevisedRevision.id },
    data: { uuid: { trashed: true } },
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
          ... on PageRevision {
            trashed
          }
        }
      }
    `,
    variables: { id: unrevisedRevision.id },
    data: { uuid: { trashed: false } },
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

test('fails when user does not have role "static_pages_builder"', async () => {
  database.hasUuid({ ...user, roles: ['login', 'de_moderator'] })

  await assertFailingGraphQLMutation({
    ...createCheckoutRevisionMutation(),
    client,
    expectedError: 'FORBIDDEN',
  })
})

test('fails when database layer returns a 400er response', async () => {
  givenPageCheckoutRevisionEndpoint(
    returnsJson({
      status: 400,
      json: { success: false, reason: 'revision is already checked out' },
    })
  )

  await assertFailingGraphQLMutation({
    ...createCheckoutRevisionMutation(),
    client,
    expectedError: 'BAD_USER_INPUT',
    message: 'revision is already checked out',
  })
})

test('fails when database layer has an internal error', async () => {
  givenPageCheckoutRevisionEndpoint(hasInternalServerError())

  await assertFailingGraphQLMutation({
    ...createCheckoutRevisionMutation(),
    client,
    expectedError: 'INTERNAL_SERVER_ERROR',
  })
})

function createCheckoutRevisionMutation() {
  return {
    mutation: gql`
      mutation ($input: CheckoutRevisionInput!) {
        page {
          checkoutRevision(input: $input) {
            success
          }
        }
      }
    `,
    variables: {
      input: { revisionId: unrevisedRevision.id, reason: 'given reason' },
    },
  }
}
