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

import { article, user } from '../../../__fixtures__'
import { createTestClient } from '../../../__tests__/__utils__'
import { mockEndpointsForThreads } from '../../../__tests__/schema/thread/thread'
import {
  addMutationInteraction,
  assertSuccessfulGraphQLMutation,
} from '../../__utils__'
import { DiscriminatorType } from '~/schema/uuid'

test('start-thread', async () => {
  global.client = createTestClient({ userId: user.id })

  mockEndpointsForThreads(article, [])

  await addMutationInteraction({
    name: 'create new thread for uuid 1855',
    given: `there exists a uuid 1855 and user with id ${user.id} is authenticated`,
    path: '/thread/start-thread',
    requestBody: {
      title: 'My new thread',
      content: '🔥 brand new!',
      objectId: article.id,
      userId: user.id,
      subscribe: true,
      sendEmail: false,
    },
    responseBody: {
      id: Matchers.integer(1000),
      title: 'My new thread',
      trashed: false,
      alias: Matchers.string('/mathe/1000/first'),
      __typename: DiscriminatorType.Comment,
      authorId: user.id,
      date: Matchers.iso8601DateTime(article.date),
      archived: false,
      content: '🔥 brand new!',
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
})
