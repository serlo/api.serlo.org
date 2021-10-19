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

import { user as baseUser } from '../../../__fixtures__'
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
  nextUuid,
} from '../../__utils__'

let database: Database

let client: Client
const user = { ...baseUser, roles: ['sysadmin'] }
const userIds = [user.id, nextUuid(user.id)]
const noUserId = nextUuid(nextUuid(user.id))

beforeEach(() => {
  database = new Database()
  database.hasUuids(
    userIds.map((id) => {
      return { ...user, id }
    })
  )

  givenUserDeleteBotsEndpoint(defaultUserDeleteBotsEndpoint({ database }))
  givenUuidQueryEndpoint(returnsUuidsFromDatabase(database))

  client = createTestClient({ userId: user.id })
})

test('runs successfully when mutation could be successfully executed', async () => {
  await assertSuccessfulGraphQLMutation({
    ...createDeleteBotsMutation({ botIds: userIds }),
    data: { user: { deleteBots: { success: true } } },
    client,
  })
})

test('updates the cache', async () => {
  givenUserDeleteBotsEndpoint(defaultUserDeleteBotsEndpoint({ database }))

  await assertSuccessfulGraphQLQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          id
        }
      }
    `,
    variables: { id: user.id },
    data: { uuid: { id: user.id } },
    client,
  })

  await assertSuccessfulGraphQLMutation({
    ...createDeleteBotsMutation({ botIds: [user.id] }),
    data: { user: { deleteBots: { success: true } } },
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
    variables: { id: user.id },
    data: { uuid: null },
    client,
  })
})

test('fails when one of the given bot ids is not a user', async () => {
  await assertFailingGraphQLMutation({
    ...createDeleteBotsMutation({ botIds: [noUserId] }),
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
          }
        }
      }
    `,
    variables: { input: { botIds: args?.botIds ?? [user.id] } },
  }
}

function givenUserDeleteBotsEndpoint(
  resolver: MessageResolver<{
    botIds: number[]
  }>
) {
  givenSerloEndpoint('UserDeleteBotsMutation', resolver)
}

function defaultUserDeleteBotsEndpoint({
  database,
}: {
  database: Database
}): MessageResolver<{ botIds: number[] }> {
  return (req, res, ctx) => {
    const { botIds } = req.body.payload

    for (const id of botIds) {
      database.deleteUuid(id)
    }

    return res(ctx.json({ success: true }))
  }
}
