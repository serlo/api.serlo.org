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

import { user } from '../../../__fixtures__'
import { createTestClient } from '../../../__tests__/__utils__'
import { assertSuccessfulGraphQLMutation } from '../../__utils__'
import { DiscriminatorType, encodeThreadId } from '~/schema/uuid'

test('comment-thread', async () => {
  global.client = createTestClient({ userId: user.id })
  await global.pact.addInteraction({
    uponReceiving: `create new comment on thread where id of first comment is 100`,
    state: `there exists a thread with a first comment with an id of 100 and ${user.id} is authenticated`,
    withRequest: {
      method: 'POST',
      path: '/api/thread/comment-thread',
      body: {
        content: 'this is my reply',
        threadId: 100,
        userId: user.id,
      },
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: {
        id: 101,
        trashed: false,
        alias: '/mathe/101',
        __typename: DiscriminatorType.Comment,
        authorId: user.id,
        title: '',
        date: '2014-08-25T12:51:02+02:00',
        archived: false,
        content: 'this is my reply',
        parentId: 100,
        childrenIds: [],
      },
    },
  })
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
        threadId: encodeThreadId(100),
      },
    },
    data: {
      thread: {
        createComment: {
          success: true,
          record: {
            archived: false,
            content: 'this is my reply',
          },
        },
      },
    },
  })

  // Check cache

  // await assertSuccessfulGraphQLQuery({
  //   query: gql`
  //     query {
  //       notifications {
  //         nodes {
  //           id
  //           unread
  //         }
  //         totalCount
  //       }
  //     }
  //   `,
  //   data: {
  //     notifications: { nodes: [{ id: 9, unread: true }], totalCount: 1 },
  //   },
  // })
})
