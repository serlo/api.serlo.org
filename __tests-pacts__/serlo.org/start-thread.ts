/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'

import { article, user } from '../../__fixtures__'
import { createTestClient } from '../../__tests__/__utils__'
import { mockEndpointsForThreads } from '../../__tests__/schema/thread/thread'
import {
  addMutationInteraction,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
} from '../__utils__'
import { DiscriminatorType } from '~/schema/uuid'

test('start-thread', async () => {
  global.client = createTestClient({ userId: user.id })

  mockEndpointsForThreads(article, [])
  await global.client.query({
    query: gql`
      query($id: Int) {
        uuid(id: $id) {
          ... on ThreadAware {
            threads {
              nodes {
                title
              }
            }
          }
        }
      }
    `,
    variables: { id: article.id },
  })

  await addMutationInteraction({
    name: 'create new thread for uuid 1565',
    given: `there exists a uuid 1565 and user with id ${user.id} is authenticated`,
    path: '/api/thread/start-thread',
    requestBody: {
      title: 'First comment in new thread',
      content: 'first!',
      objectId: article.id,
      userId: user.id,
    },
    responseBody: {
      id: Matchers.integer(1000),
      title: 'First comment in new thread',
      trashed: false,
      alias: Matchers.string('/mathe/1000/first'),
      __typename: DiscriminatorType.Comment,
      authorId: user.id,
      date: Matchers.iso8601DateTime(article.date),
      archived: false,
      content: 'first!',
      parentId: article.id,
      childrenIds: [],
    },
  })
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
    variables: {
      input: {
        title: 'First comment in new thread',
        content: 'first!',
        objectId: article.id,
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
                  content: 'first!',
                  title: 'First comment in new thread',
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
                title
              }
            }
          }
        }
      }
    `,
    variables: { id: article.id },
    data: {
      uuid: { threads: { nodes: [{ title: 'First comment in new thread' }] } },
    },
  })
})
