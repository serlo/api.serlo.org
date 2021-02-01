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
import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'

import { article, comment, user } from '../../../__fixtures__'
import {
  createTestClient,
  createUuidHandler,
} from '../../../__tests__/__utils__'
import { mockEndpointsForThreads } from '../../../__tests__/schema/thread/thread'
import {
  assertSuccessfulGraphQLQuery,
  addMutationInteraction,
  assertSuccessfulGraphQLMutation,
} from '../../__utils__'
import { encodeThreadId } from '~/schema/thread'
import { DiscriminatorType } from '~/schema/uuid'

test('comment-thread', async () => {
  global.client = createTestClient({ userId: user.id })
  await addMutationInteraction({
    name: 'create new comment on thread where id of first comment is 100',
    given: `there exists a thread with a first comment with an id of 100 and ${user.id} is authenticated`,
    path: '/thread/comment-thread',
    requestBody: {
      content: 'this is my reply',
      threadId: comment.id,
      userId: user.id,
    },
    responseBody: {
      id: Matchers.integer(comment.id + 1),
      trashed: false,
      alias: Matchers.string('/mathe/101/mathe'),
      __typename: DiscriminatorType.Comment,
      authorId: user.id,
      title: null,
      date: Matchers.iso8601DateTime(comment.date),
      archived: false,
      content: 'this is my reply',
      parentId: comment.id,
      childrenIds: [],
    },
  })
  global.server.use(createUuidHandler(comment))
  await global.client.query({
    query: gql`
      query($id: Int) {
        uuid(id: $id) {
          __typename
        }
      }
    `,
    variables: { id: comment.id },
  })
  mockEndpointsForThreads(article, [[comment]])

  await assertSuccessfulGraphQLMutation({
    mutation: gql`
      mutation createThread($input: ThreadCreateCommentInput!) {
        thread {
          createComment(input: $input) {
            success
            record {
              archived
              content
            }
          }
        }
      }
    `,
    variables: {
      input: {
        content: 'this is my reply',
        threadId: encodeThreadId(comment.id),
      },
    },
    data: {
      thread: {
        createComment: {
          success: true,
          record: { archived: false, content: 'this is my reply' },
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
    data: {
      uuid: {
        threads: {
          nodes: [
            {
              comments: {
                nodes: [
                  { content: comment.content },
                  { content: 'this is my reply' },
                ],
              },
            },
          ],
        },
      },
    },
  })
})
