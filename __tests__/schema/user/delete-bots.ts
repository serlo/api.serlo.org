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

import { article, user as baseUser } from '../../../__fixtures__'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  createTestClient,
  givenUuidQueryEndpoint,
  hasInternalServerError,
  Client,
  Database,
  returnsUuidsFromDatabase,
  MessageResolver,
  givenSerloEndpoint,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'

let database: Database

let client: Client
const user = { ...baseUser, roles: ['sysadmin'] }

beforeEach(() => {
  database = new Database()
  database.hasUuids(
    [user.id, user.id + 1].map((id) => {
      return { ...user, id }
    })
  )

  givenUserDeleteBotsEndpoint(defaultUserDeleteBotsEndpoint({ database }))
  givenUuidQueryEndpoint(returnsUuidsFromDatabase(database))

  client = createTestClient({ userId: user.id })
})

test('runs successfully when mutation could be successfully executed', async () => {
  await assertSuccessfulGraphQLMutation({
    ...createDeleteBotsMutation({ botIds: [user.id, user.id + 1] }),
    data: {
      user: {
        deleteBots: [
          { success: true, username: user.username, reason: null },
          { success: true, username: user.username, reason: null },
        ],
      },
    },
    client,
  })
})

test('runs partially when one of the mutations failed', async () => {
  givenUserDeleteBotsEndpoint(
    defaultUserDeleteBotsEndpoint({
      database,
      failsForBotIds: [user.id],
      reason: 'failure!',
    })
  )

  await assertSuccessfulGraphQLMutation({
    ...createDeleteBotsMutation({ botIds: [user.id, user.id + 1] }),
    data: {
      user: {
        deleteBots: [
          { success: false, username: user.username, reason: 'failure!' },
          { success: true, username: user.username, reason: null },
        ],
      },
    },
    client,
  })
})

test('updates the cache', async () => {
  database.hasUuid(article)
  givenUserDeleteBotsEndpoint(
    defaultUserDeleteBotsEndpoint({ database, uuidsToDelete: [article.id] })
  )

  await assertSuccessfulGraphQLQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          id
        }
      }
    `,
    variables: { id: article.id },
    data: { uuid: { id: article.id } },
    client,
  })

  await assertSuccessfulGraphQLMutation({
    ...createDeleteBotsMutation({ botIds: [user.id] }),
    data: {
      user: {
        deleteBots: [{ success: true, username: user.username, reason: null }],
      },
    },
    client,
  })

  await assertSuccessfulGraphQLQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          id
        }
      }
    `,
    variables: { id: article.id },
    data: { uuid: null },
    client,
  })
})

test('fails when one of the given bot ids is not a user', async () => {
  await assertFailingGraphQLMutation({
    ...createDeleteBotsMutation({ botIds: [user.id + 2] }),
    client,
    expectedError: 'BAD_USER_INPUT',
  })
})

test('fails when user is not authenticated', async () => {
  const client = createTestClient({ userId: null })

  await assertFailingGraphQLMutation({
    ...createDeleteBotsMutation(),
    client,
    expectedError: 'UNAUTHENTICATED',
  })
})

test('fails when user does not have role "sysadmin"', async () => {
  database.hasUuid({ ...user, roles: ['login', 'de_admin'] })

  await assertFailingGraphQLMutation({
    ...createDeleteBotsMutation(),
    client,
    expectedError: 'FORBIDDEN',
  })
})

test('fails when database layer has an internal error', async () => {
  givenUserDeleteBotsEndpoint(hasInternalServerError())

  await assertFailingGraphQLMutation({
    ...createDeleteBotsMutation(),
    client,
    expectedError: 'INTERNAL_SERVER_ERROR',
  })
})

function createDeleteBotsMutation(args?: { botIds?: number[] }) {
  return {
    mutation: gql`
      mutation ($input: UserDeleteBotsInput!) {
        user {
          deleteBots(input: $input) {
            success
            username
            reason
          }
        }
      }
    `,
    variables: { input: { botIds: args?.botIds ?? [user.id] } },
  }
}

function givenUserDeleteBotsEndpoint(
  resolver: MessageResolver<{
    botId: number
  }>
) {
  givenSerloEndpoint('UserDeleteBotsMutation', resolver)
}

function defaultUserDeleteBotsEndpoint({
  database,
  reason,
  failsForBotIds = [],
  uuidsToDelete = [],
}: {
  database: Database
  failsForBotIds?: number[]
  reason?: string
  uuidsToDelete?: number[]
}): MessageResolver<{ botId: number }> {
  return (req, res, ctx) => {
    const { botId } = req.body.payload

    if (failsForBotIds.includes(botId))
      return res(ctx.json({ success: false, reason }))

    const deletedUuids = [...uuidsToDelete, botId]

    for (const id of deletedUuids) {
      database.deleteUuid(id)
    }

    return res(ctx.json({ success: true, deletedUuids }))
  }
}
