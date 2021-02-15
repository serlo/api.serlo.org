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

import { article, comment, comment1, user } from '../../../__fixtures__'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
  createMessageHandler,
  createTestClient,
} from '../../__utils__'
import { mockEndpointsForThreads } from './thread'

test('unauthenticated user gets error', async () => {
  await assertFailingGraphQLMutation({
    mutation: gql`
      mutation($input: ThreadCreateThreadInput!) {
        thread {
          createThread(input: $input) {
            success
          }
        }
      }
    `,
    variables: {
      input: {
        content: 'Hello',
        title: 'Hello',
        objectId: article.id,
        subscribe: true,
        sendEmail: false,
      },
    },
    client: createTestClient({ userId: null }),
    expectedError: 'UNAUTHENTICATED',
  })
})

test('thread gets created, cache mutated as expected', async () => {
  const client = createTestClient({ userId: user.id })

  mockEndpointsForThreads(article, [[comment]])

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

  global.server.use(
    createMessageHandler({
      message: {
        type: 'ThreadCreateThreadMutation',
        payload: {
          title: 'My new thread',
          content: '🔥 brand new!',
          objectId: article.id,
          subscribe: true,
          sendEmail: false,
          userId: user.id,
        },
      },
      body: {
        __typename: 'comment',
        id: comment1.id,
        trashed: false,
        alias: null,
        authorId: user.id,
        title: 'My new thread',
        date: '2014-08-25T12:51:02+02:00',
        archived: false,
        content: '🔥 brand new!',
        parentId: article.id,
        childrenIds: [],
      },
    })
  )

  await assertSuccessfulGraphQLMutation({
    mutation: gql`
      mutation createThread($input: ThreadCreateThreadInput!) {
        thread {
          createThread(input: $input) {
            success
            record {
              archived
              comments {
                nodes {
                  content
                  title
                }
              }
            }
          }
        }
      }
    `,
    client,
    variables: {
      input: {
        title: 'My new thread',
        content: '🔥 brand new!',
        objectId: article.id,
        subscribe: true,
        sendEmail: false,
      },
    },
    data: {
      thread: {
        createThread: {
          success: true,
          record: {
            archived: false,
            comments: {
              nodes: [
                {
                  title: 'My new thread',
                  content: '🔥 brand new!',
                },
              ],
            },
          },
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
                    title
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
                nodes: [{ title: 'My new thread', content: '🔥 brand new!' }],
              },
            },
            {
              comments: {
                nodes: [{ title: comment.title, content: comment.content }],
              },
            },
          ],
        },
      },
    },
  })
})
