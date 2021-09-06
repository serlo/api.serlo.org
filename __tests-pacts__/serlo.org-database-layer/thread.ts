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

import { article, comment, comment3, user } from '../../__fixtures__'
import {
  createTestClient,
  createUuidHandler,
  nextUuid,
} from '../../__tests__/__utils__'
import {
  addMessageInteraction,
  assertSuccessfulGraphQLMutation,
} from '../__utils__'
import { DiscriminatorType } from '~/model/decoder'
import { encodeThreadId } from '~/schema/thread/utils'

test('ThreadsQuery', async () => {
  await addMessageInteraction({
    given: `article ${article.id} has threads`,
    message: {
      type: 'ThreadsQuery',
      payload: { id: article.id },
    },
    responseBody: {
      firstCommentIds: Matchers.eachLike(Matchers.integer(1)),
    },
  })
  const response = await global.serloModel.getThreadIds({ id: article.id })
  expect(response).toEqual({ firstCommentIds: [1] })
})

test('ThreadCreateThreadMutation', async () => {
  global.client = createTestClient({ userId: user.id })
  global.server.use(createUuidHandler(article), createUuidHandler(user))

  await addMessageInteraction({
    given: `there exists a uuid 1855 and user with id ${user.id} is authenticated`,
    message: {
      type: 'ThreadCreateThreadMutation',
      payload: {
        title: 'My new thread',
        content: '🔥 brand new!',
        objectId: article.id,
        userId: user.id,
        subscribe: true,
        sendEmail: false,
      },
    },
    responseBody: {
      __typename: DiscriminatorType.Comment,
      id: Matchers.integer(1000),
      title: 'My new thread',
      trashed: false,
      alias: Matchers.string('/mathe/1000/first'),
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

test('ThreadCreateCommentMutation', async () => {
  global.client = createTestClient({ userId: user.id })
  global.server.use(
    createUuidHandler(article),
    createUuidHandler(comment),
    createUuidHandler(user)
  )

  await addMessageInteraction({
    given: `there exists a thread with a first comment with an id of ${comment.id} and ${user.id} is authenticated`,
    message: {
      type: 'ThreadCreateCommentMutation',
      payload: {
        content: 'Hello',
        threadId: comment.id,
        userId: user.id,
        subscribe: true,
        sendEmail: false,
      },
    },
    responseBody: {
      __typename: DiscriminatorType.Comment,
      id: Matchers.integer(nextUuid(comment.id)),
      content: 'Hello',
      authorId: Matchers.integer(user.id),
      parentId: comment.id,
      trashed: false,
      alias: Matchers.string('/mathe/101/mathe'),
      date: Matchers.iso8601DateTime(comment.date),
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
        threadId: encodeThreadId(comment.id),
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

test('ThreadSetThreadArchivedMutation', async () => {
  global.client = createTestClient({ userId: user.id })
  global.server.use(
    createUuidHandler(article),
    createUuidHandler({ ...comment, id: comment3.id }),
    createUuidHandler(user)
  )

  await addMessageInteraction({
    given: `there exists a thread with a first comment with an id of ${comment3.id} and user with id ${user.id} is authenticated`,
    message: {
      type: 'ThreadSetThreadArchivedMutation',
      payload: { ids: [comment3.id], userId: user.id, archived: true },
    },
  })

  await assertSuccessfulGraphQLMutation({
    mutation: gql`
      mutation archiveThread($input: ThreadSetThreadArchivedInput!) {
        thread {
          setThreadArchived(input: $input) {
            success
          }
        }
      }
    `,
    variables: { input: { id: encodeThreadId(comment3.id), archived: true } },
    data: { thread: { setThreadArchived: { success: true } } },
  })
})
