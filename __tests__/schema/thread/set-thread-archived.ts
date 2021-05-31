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
  createUuidHandler,
} from '../../__utils__'
import { mockEndpointsForThreads } from './thread'
import { encodeThreadId } from '~/schema/thread/utils'

describe('archive-comment', () => {
  const mutation = gql`
    mutation setThreadArchived($input: ThreadSetThreadArchivedInput!) {
      thread {
        setThreadArchived(input: $input) {
          success
        }
      }
    }
  `

  test('unauthenticated user gets error', async () => {
    global.server.use(createUuidHandler(article), createUuidHandler(comment))
    const client = createTestClient({ userId: null })
    await assertFailingGraphQLMutation({
      mutation,
      variables: { input: { id: encodeThreadId(comment.id), archived: true } },
      client,
      expectedError: 'UNAUTHENTICATED',
    })
  })

  test('setting multiple ids', async () => {
    global.server.use(
      createUuidHandler(article),
      createUuidHandler(comment),
      createUuidHandler(comment1),
      createUuidHandler(user)
    )
    const client = createTestClient({ userId: user.id })

    global.server.use(
      createMessageHandler({
        message: {
          type: 'ThreadSetThreadArchivedMutation',
          payload: {
            userId: user.id,
            ids: [comment1.id, comment.id],
            archived: true,
          },
        },
      })
    )

    await assertSuccessfulGraphQLMutation({
      mutation,
      client,
      variables: {
        input: {
          id: [encodeThreadId(comment1.id), encodeThreadId(comment.id)],
          archived: true,
        },
      },
      data: { thread: { setThreadArchived: { success: true } } },
    })
  })

  test('cache gets updated as expected', async () => {
    const client = createTestClient({ userId: user.id })
    global.server.use(
      createUuidHandler(article),
      createUuidHandler(comment1),
      createUuidHandler(user)
    )

    mockEndpointsForThreads(article, [[{ ...comment1, archived: true }]])
    global.server.use(
      createMessageHandler({
        message: {
          type: 'ThreadSetThreadArchivedMutation',
          payload: {
            userId: user.id,
            ids: [comment1.id],
            archived: false,
          },
        },
      })
    )

    const query = gql`
      query ($id: Int) {
        uuid(id: $id) {
          ... on ThreadAware {
            threads {
              nodes {
                archived
              }
            }
          }
        }
      }
    `

    // fill cache
    await client.query({
      query,
      variables: { id: article.id },
    })

    await assertSuccessfulGraphQLMutation({
      mutation,
      client,
      variables: {
        input: { id: encodeThreadId(comment1.id), archived: false },
      },
      data: { thread: { setThreadArchived: { success: true } } },
    })

    await assertSuccessfulGraphQLQuery({
      query,
      client,
      variables: { id: article.id },
      data: { uuid: { threads: { nodes: [{ archived: false }] } } },
    })
  })
})
