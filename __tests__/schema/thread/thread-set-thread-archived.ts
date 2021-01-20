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
import { gql } from 'apollo-server'
import { rest } from 'msw'

import { comment, user } from '../../../__fixtures__'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  Client,
  createTestClient,
  getSerloUrl,
} from '../../__utils__'
import { encodeThreadId } from '~/schema/uuid/thread/utils'

let client: Client

beforeEach(() => {
  client = createTestClient({ userId: user.id })
})

describe('archive-comment', () => {
  beforeEach(() => mockArchiveCommentEndpoint())

  const mutation = gql`
    mutation setThreadArchived($input: ThreadSetThreadArchivedInput!) {
      thread {
        setThreadArchived(input: $input) {
          success
        }
      }
    }
  `

  test('returns success', async () => {
    await assertSuccessfulGraphQLMutation({
      mutation,
      client,
      variables: {
        input: { id: encodeThreadId(comment.id), archived: true },
      },
      data: {
        thread: { setThreadArchived: { success: true } },
      },
    })
  })

  test('mutation is unsuccessful for non existing id', async () => {
    await assertFailingGraphQLMutation({
      mutation,
      variables: {
        input: { id: encodeThreadId(comment.id + 1), archived: true },
      },
      client,
      expectedError: 'BAD_REQUEST',
    })
  })

  test('unauthenticated user gets error', async () => {
    const client = createTestClient({ userId: null })
    await assertFailingGraphQLMutation({
      mutation,
      variables: { input: { id: encodeThreadId(comment.id), archived: true } },
      client,
      expectedError: 'UNAUTHENTICATED',
    })
  })
})

function mockArchiveCommentEndpoint() {
  global.server.use(
    rest.post<{
      id: number
      userId: number
      archived: boolean
    }>(getSerloUrl({ path: '/api/thread/set-archive' }), (req, res, ctx) => {
      const { id, userId, archived } = req.body

      if (userId !== user.id) return res(ctx.status(403))
      if (id !== comment.id) return res(ctx.status(400))

      return res(ctx.json({ ...comment, archived: archived }))
    })
  )
}
