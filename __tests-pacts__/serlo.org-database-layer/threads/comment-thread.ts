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
import fetch from 'node-fetch'

import { comment1, user } from '../../../__fixtures__'
import { createTestClient } from '../../../__tests__/__utils__'
import {
  addMutationInteraction,
  assertSuccessfulGraphQLMutation,
} from '../../__utils__'
import { encodeThreadId } from '~/schema/thread'

test('comment-thread', async () => {
  global.client = createTestClient({ userId: user.id })

  await addMutationInteraction({
    name: `create new comment on thread where id of first comment is ${comment1.id}`,
    given: `there exists a thread with a first comment with an id of ${comment1.id} and ${user.id} is authenticated`,
    path: '/thread/comment-thread',
    requestBody: {
      content: 'Hello',
      threadId: comment1.id,
      userId: user.id,
      subscribe: true,
      sendEmail: false,
    },
    responseBody: {
      __typename: 'comment',
      id: Matchers.integer(comment1.id + 1),
      content: 'Hello',
      parentId: comment1.id,
      trashed: false,
      alias: Matchers.string('/mathe/101/mathe'),
      date: Matchers.iso8601DateTime(comment1.date),
      title: null,
      archived: false,
      childrenIds: [],
    },
  })

  await assertSuccessfulGraphQLMutation({
    mutation: gql`
      mutation createComment($input: ThreadCreateCommentInput!) {
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
    data: {
      thread: {
        createComment: {
          success: true,
        },
      },
    },
  })
})
