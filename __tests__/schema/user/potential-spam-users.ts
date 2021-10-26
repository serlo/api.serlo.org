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

import { user, user2 } from '../../../__fixtures__'
import {
  createTestClient,
  assertSuccessfulGraphQLQuery,
  createMessageHandler,
  createUuidHandler,
  getTypenameAndId,
  assertFailingGraphQLQuery,
} from '../../__utils__'

beforeEach(() => {
  global.server.use(
    createUuidHandler(user),
    createUuidHandler(user2),
    createPotentialSpamUsersEndpoint({ userIds: [user.id, user2.id] }),
    createPotentialSpamUsersEndpoint({ after: user.id, userIds: [user2.id] })
  )
})

describe('endpoint user.potentialSpamUsers', () => {
  test('without parameter `after`', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query {
          user {
            potentialSpamUsers(first: 100) {
              nodes {
                id
                __typename
              }
            }
          }
        }
      `,
      data: {
        user: {
          potentialSpamUsers: {
            nodes: [getTypenameAndId(user), getTypenameAndId(user2)],
          },
        },
      },
      client: createTestClient(),
    })
  })

  test('with paramater `after`', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query ($after: String!) {
          user {
            potentialSpamUsers(first: 100, after: $after) {
              nodes {
                id
                __typename
              }
            }
          }
        }
      `,
      variables: { after: Buffer.from(user.id.toString()).toString('base64') },
      data: {
        user: { potentialSpamUsers: { nodes: [getTypenameAndId(user2)] } },
      },
      client: createTestClient(),
    })
  })

  test('fails when `first` is bigger then 500', async () => {
    await assertFailingGraphQLQuery({
      query: gql`
        query {
          user {
            potentialSpamUsers(first: 501) {
              nodes {
                id
                __typename
              }
            }
          }
        }
      `,
      expectedError: 'BAD_USER_INPUT',
      client: createTestClient(),
    })
  })

  test('fails when `after` is not a valid id', async () => {
    await assertFailingGraphQLQuery({
      query: gql`
        query {
          user {
            potentialSpamUsers(after: "foo") {
              nodes {
                id
                __typename
              }
            }
          }
        }
      `,
      expectedError: 'BAD_USER_INPUT',
      client: createTestClient(),
    })
  })
})

function createPotentialSpamUsersEndpoint({
  userIds,
  after = null,
}: {
  userIds: number[]
  after?: number | null
}) {
  return createMessageHandler({
    message: {
      type: 'UserPotentialSpamUsersQuery',
      payload: { first: 101, after },
    },
    body: { userIds },
  })
}
