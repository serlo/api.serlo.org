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
  returnsJson,
  Database,
  returnsUuidsFromDatabase,
  MessageResolver,
  givenSerloEndpoint,
} from '../../__utils__'

let database: Database

let client: Client
const user = { ...baseUser, roles: ['sysadmin'] }

beforeEach(() => {
  database = new Database()
  database.hasUuid(user)

  givenUuidQueryEndpoint(returnsUuidsFromDatabase(database))

  client = createTestClient({ userId: user.id })
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  givenSetEmailEndpoint((req, res, ctx) => {
    const { userId, email } = req.body.payload

    // TODO: There must be a better implementation to check whether the right
    // parameters are given as payload
    if (userId !== user.id || email !== 'user@example.org')
      return res(ctx.status(500))

    return res(ctx.json({ success: true, username: user.username }))
  })

  await assertSuccessfulGraphQLMutation({
    ...createSetEmailMutation(),
    data: {
      user: {
        setEmail: {
          success: true,
          username: user.username,
          email: 'user@example.org',
        },
      },
    },
    client,
  })
})

test('fails when user is not authenticated', async () => {
  const client = createTestClient({ userId: null })

  await assertFailingGraphQLMutation({
    ...createSetEmailMutation(),
    client,
    expectedError: 'UNAUTHENTICATED',
  })
})

test('fails when user does not have role "sysadmin"', async () => {
  database.hasUuid({ ...user, roles: ['login', 'de_admin'] })

  await assertFailingGraphQLMutation({
    ...createSetEmailMutation(),
    client,
    expectedError: 'FORBIDDEN',
  })
})

test('fails when database layer returns a 400er response', async () => {
  givenSetEmailEndpoint(
    returnsJson({
      status: 400,
      json: { success: false, reason: 'user with id "2" does not exist' },
    })
  )

  await assertFailingGraphQLMutation({
    ...createSetEmailMutation(),
    client,
    expectedError: 'BAD_USER_INPUT',
    message: 'user with id "2" does not exist',
  })
})

test('fails when database layer has an internal error', async () => {
  givenSetEmailEndpoint(hasInternalServerError())

  await assertFailingGraphQLMutation({
    ...createSetEmailMutation(),
    client,
    expectedError: 'INTERNAL_SERVER_ERROR',
  })
})

function createSetEmailMutation() {
  return {
    mutation: gql`
      mutation ($input: UserSetEmailInput!) {
        user {
          setEmail(input: $input) {
            success
            username
            email
          }
        }
      }
    `,
    variables: { input: { userId: user.id, email: 'user@example.org' } },
  }
}

function givenSetEmailEndpoint(
  resolver: MessageResolver<{
    userId: number
    email: string
  }>
) {
  givenSerloEndpoint('UserSetEmailMutation', resolver)
}
