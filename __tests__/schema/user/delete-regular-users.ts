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

import { user as baseUser } from '../../../__fixtures__'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  createTestClient,
  given,
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

  givenUserDeleteRegularUsersEndpoint(
    defaultUserDeleteRegularUsersEndpoint({ database })
  )
  given('UuidQuery').isDefinedBy(returnsUuidsFromDatabase(database))

  client = createTestClient({ userId: user.id })
})

test('runs successfully when mutation could be successfully executed', async () => {
  await assertSuccessfulGraphQLMutation({
    ...createDeleteRegularUsersMutation({ userIds }),
    data: {
      user: {
        deleteRegularUsers: [
          { success: true, username: user.username, reason: null },
          { success: true, username: user.username, reason: null },
        ],
      },
    },
    client,
  })
})

test('runs partially when one of the mutations failed', async () => {
  givenUserDeleteRegularUsersEndpoint(
    defaultUserDeleteRegularUsersEndpoint({
      database,
      failsForUserIds: [user.id],
      reason: 'failure!',
    })
  )

  await assertSuccessfulGraphQLMutation({
    ...createDeleteRegularUsersMutation({ userIds }),
    data: {
      user: {
        deleteRegularUsers: [
          { success: false, username: user.username, reason: 'failure!' },
          { success: true, username: user.username, reason: null },
        ],
      },
    },
    client,
  })
})

test('updates the cache', async () => {
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
    ...createDeleteRegularUsersMutation({ userIds: [user.id] }),
    data: {
      user: {
        deleteRegularUsers: [
          { success: true, username: user.username, reason: null },
        ],
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
    variables: { id: user.id },
    data: { uuid: null },
    client,
  })
})

test('fails when one of the given bot ids is not a user', async () => {
  await assertFailingGraphQLMutation({
    ...createDeleteRegularUsersMutation({ userIds: [noUserId] }),
    client,
    expectedError: 'BAD_USER_INPUT',
  })
})

test('fails when user is not authenticated', async () => {
  const client = createTestClient({ userId: null })

  await assertFailingGraphQLMutation({
    ...createDeleteRegularUsersMutation(),
    client,
    expectedError: 'UNAUTHENTICATED',
  })
})

test('fails when user does not have role "sysadmin"', async () => {
  database.hasUuid({ ...user, roles: ['login', 'de_admin'] })

  await assertFailingGraphQLMutation({
    ...createDeleteRegularUsersMutation(),
    client,
    expectedError: 'FORBIDDEN',
  })
})

test('fails when database layer has an internal error', async () => {
  givenUserDeleteRegularUsersEndpoint(hasInternalServerError())

  await assertFailingGraphQLMutation({
    ...createDeleteRegularUsersMutation(),
    client,
    expectedError: 'INTERNAL_SERVER_ERROR',
  })
})

function createDeleteRegularUsersMutation(args?: { userIds?: number[] }) {
  return {
    mutation: gql`
      mutation ($input: UserDeleteRegularUsersInput!) {
        user {
          deleteRegularUsers(input: $input) {
            success
            username
            reason
          }
        }
      }
    `,
    variables: { input: { userIds: args?.userIds ?? [user.id] } },
  }
}

function givenUserDeleteRegularUsersEndpoint(
  resolver: MessageResolver<
    string,
    {
      userId: number
    }
  >
) {
  givenSerloEndpoint('UserDeleteRegularUsersMutation', resolver)
}

function defaultUserDeleteRegularUsersEndpoint({
  database,
  reason,
  failsForUserIds = [],
}: {
  database: Database
  failsForUserIds?: number[]
  reason?: string
}): MessageResolver<string, { userId: number }> {
  return (req, res, ctx) => {
    const { userId } = req.body.payload

    if (failsForUserIds.includes(userId))
      return res(ctx.json({ success: false, reason }))

    database.deleteUuid(userId)

    return res(ctx.json({ success: true }))
  }
}
