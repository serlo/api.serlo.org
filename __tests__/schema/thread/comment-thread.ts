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

import { article, comment1, user } from '../../../__fixtures__'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
  createMessageHandler,
  createTestClient,
} from '../../__utils__'
import { mockEndpointsForThreads } from './thread'
import { encodeThreadId } from '~/schema/thread/utils'

test('unauthenticated user gets error', async () => {
  await assertFailingGraphQLMutation({
    mutation: gql`
      mutation($input: ThreadCreateCommentInput!) {
        thread {
          createComment(input: $input) {
            success
          }
        }
      }
    `,
    variables: {
      input: {
        content: 'Hello',
        threadId: encodeThreadId(comment1.id),
        subscribe: true,
        sendEmail: false,
      },
    },
    client: createTestClient({ userId: null }),
    expectedError: 'UNAUTHENTICATED',
  })
})

test('comment gets created, cache mutated as expected', async () => {
  const client = createTestClient({ userId: user.id })

  global.server.use(
    createMessageHandler({
      message: {
        type: 'ThreadCreateCommentMutation',
        payload: {
          userId: user.id,
          content: 'Hello',
          threadId: comment1.id,
          subscribe: true,
          sendEmail: false,
        },
      },
      body: {
        __typename: 'Comment',
        id: comment1.id + 1,
        trashed: false,
        alias: `/mathe/${comment1.id + 1}/`,
        authorId: user.id,
        title: null,
        date: '2014-03-01T20:45:56Z',
        archived: false,
        content: 'Hello',
        parentId: comment1.id,
        childrenIds: [],
      },
    })
  )

  mockEndpointsForThreads(article, [[comment1]])

  //fill cache
  await client.query({
    query: gql`
      query($id: Int) {
        uuid(id: $id) {
          ... on ThreadAware {
            threads {
              nodes {
                comments {
                  nodes {
                    content
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: { id: article.id },
  })

  await assertSuccessfulGraphQLMutation({
    mutation: gql`
      mutation($input: ThreadCreateCommentInput!) {
        thread {
          createComment(input: $input) {
            success
            record {
              archived
              content
              id
            }
          }
        }
      }
    `,
    variables: {
      input: {
        content: 'Hello',
        threadId: encodeThreadId(comment1.id),
        subscribe: true,
        sendEmail: false,
      },
    },
    client,
    data: {
      thread: {
        createComment: {
          success: true,
          record: { archived: false, content: 'Hello', id: comment1.id + 1 },
        },
      },
    },
  })

  await assertSuccessfulGraphQLQuery({
    query: gql`
      query($id: Int) {
        uuid(id: $id) {
          ... on ThreadAware {
            threads {
              nodes {
                comments {
                  nodes {
                    content
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: { id: article.id },
    client,
    data: {
      uuid: {
        threads: {
          nodes: [
            {
              comments: {
                nodes: [{ content: comment1.content }, { content: 'Hello' }],
              },
            },
          ],
        },
      },
    },
  })
})
