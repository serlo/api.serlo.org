/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { thread } from '../../__fixtures__/threads'
import { user } from '../../__fixtures__/uuid'
import { ThreadsPayload } from '../../src/graphql/schema'
import { MutationCreateThreadArgs } from '../../src/types'
import {
  assertSuccessfulGraphQLQuery,
  assertSuccessfulGraphQLMutation,
} from '../__utils__/assertions'
import { createTestClient } from '../__utils__/test-client'

const server = setupServer(
  rest.get(
    `http://de.${process.env.SERLO_ORG_HOST}/api/uuid/${user.id}`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ discriminator: 'user', ...user }))
    }
  ),
  rest.get(
    `http://de.${process.env.SERLO_ORG_HOST}/api/threads/${user.id}`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          objectId: user.id,
          threadIds: [],
        } as ThreadsPayload)
      )
    }
  ),
  rest.post(
    `http://de.${process.env.SERLO_ORG_HOST}/api/create-thread`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(thread))
    }
  )
)

beforeAll(() => {
  // Enable the mocking before all tests
  server.listen()
})

afterAll(() => {
  // Clean up the mocking once done
  server.close()
})

test('createThread', async () => {
  const { client } = createTestClient({ user: user.id })
  await assertSuccessfulGraphQLMutation({
    mutation: gql`
      mutation createThread(
        $createdAt: DateTime!
        $updatedAt: DateTime!
        $title: String!
        $objectId: Int!
        $content: String!
      ) {
        createThread(
          createdAt: $createdAt
          updatedAt: $updatedAt
          title: $title
          objectId: $objectId
          content: $content
        ) {
          id
        }
      }
    `,
    variables: {
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
      title: thread.title,
      objectId: user.id,
      content: thread.comments[0].content,
    } as MutationCreateThreadArgs,
    data: {
      createThread: {
        id: thread.id,
      },
    },
    client,
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      {
        uuid(id: 1) {
          __typename
          ... on User {
            id
            trashed
            username
            date
            lastLogin
            description
            threads {
              totalCount
              nodes {
                id
                updatedAt
                createdAt
                title
                archived
                trashed
                object {
                  ... on User {
                    id
                    username
                  }
                }
                comments {
                  totalCount
                  nodes {
                    id
                    content
                    updatedAt
                    createdAt
                    author {
                      id
                      username
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    client,
    data: {
      uuid: {
        ...user,
        threads: {
          totalCount: 1,
          nodes: [
            {
              id: 1,
              updatedAt: '2014-03-01T20:45:56Z',
              createdAt: '2014-03-01T20:45:56Z',
              title: 'title',
              archived: false,
              trashed: false,
              object: {
                id: user.id,
                username: user.username,
              },
              comments: {
                totalCount: 1,
                nodes: [
                  {
                    id: 1,
                    content: 'content',
                    updatedAt: '2014-03-01T20:45:56Z',
                    createdAt: '2014-03-01T20:45:56Z',
                    author: {
                      id: user.id,
                      username: user.username,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    },
  })
})
