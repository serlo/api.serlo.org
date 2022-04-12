/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'

import { article, comment, user } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'
import { encodeThreadId } from '~/schema/thread/utils'

const mutation = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    mutation setThreadState($input: ThreadSetThreadStateInput!) {
      thread {
        setThreadState(input: $input) {
          success
        }
      }
    }
  `,
  variables: {
    input: { id: encodeThreadId(comment.id), trashed: true },
  },
})

beforeEach(() => {
  given('UuidQuery').for(article, comment, user)
})

test('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('trashing thread returns success', async () => {
  given('UuidSetStateMutation')
    .withPayload({ ids: [comment.id], userId: user.id, trashed: true })
    .returns(undefined)

  await mutation.shouldReturnData({
    thread: { setThreadState: { success: true } },
  })
})
