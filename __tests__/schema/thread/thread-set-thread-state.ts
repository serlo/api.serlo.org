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

describe('setThreadState', () => {
  beforeEach(() => mockSetUuidStateEndpoint())

  const mutation = gql`
    mutation setThreadState($input: ThreadSetThreadStateInput!) {
      thread {
        setThreadState(input: $input) {
          success
        }
      }
    }
  `

  test('deleting thread returns success', async () => {
    await assertSuccessfulGraphQLMutation({
      mutation,
      client,
      variables: {
        input: { id: encodeThreadId(comment.id), trashed: true },
      },
      data: {
        thread: { setThreadState: { success: true } },
      },
    })
  })

  test('mutation is unsuccessful for non existing id', async () => {
    await assertFailingGraphQLMutation({
      mutation,
      variables: {
        input: { id: encodeThreadId(comment.id + 1), trashed: true },
      },
      client,
      expectedError: 'BAD_REQUEST',
    })
  })

  test('unauthenticated user gets error', async () => {
    const client = createTestClient({ userId: null })
    await assertFailingGraphQLMutation({
      mutation,
      variables: {
        input: { id: encodeThreadId(comment.id), trashed: true },
      },
      client,
      expectedError: 'UNAUTHENTICATED',
    })
  })
})

function mockSetUuidStateEndpoint() {
  global.server.use(
    rest.post<{
      userId: number
      trashed: boolean
      id: number
    }>(getSerloUrl({ path: '/api/set-uuid-state' }), (req, res, ctx) => {
      const { userId, trashed, id } = req.body
      if (userId !== user.id) return res(ctx.status(403))
      if (id !== comment.id) return res(ctx.status(400))

      return res(ctx.json({ ...comment, trashed: trashed }))
    })
  )
}
