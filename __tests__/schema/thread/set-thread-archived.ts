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

import { article, comment, comment1, user } from '../../../__fixtures__'
import { Client, given, givenThreads } from '../../__utils__'
import { encodeThreadId } from '~/schema/thread/utils'

const mutation = new Client({ userId: user.id })
  .prepareQuery<{
    input: { id: string | string[]; archived: boolean }
  }>({
    query: gql`
      mutation setThreadArchived($input: ThreadSetThreadArchivedInput!) {
        thread {
          setThreadArchived(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput({ id: encodeThreadId(comment1.id), archived: true })

beforeEach(() => {
  givenThreads({ uuid: article, threads: [[{ ...comment1, archived: false }]] })
  given('UuidQuery').for(comment, user)
})

test('setting multiple ids', async () => {
  given('ThreadSetThreadArchivedMutation')
    .withPayload({
      userId: user.id,
      ids: [comment1.id, comment.id],
      archived: true,
    })
    .returns(undefined)

  await mutation
    .withInput({
      id: [encodeThreadId(comment1.id), encodeThreadId(comment.id)],
      archived: true,
    })
    .shouldReturnData({ thread: { setThreadArchived: { success: true } } })
})

test('cache gets updated as expected', async () => {
  given('ThreadSetThreadArchivedMutation')
    .withPayload({ userId: user.id, ids: [comment1.id], archived: true })
    .returns(undefined)

  const commentQuery = new Client()
    .prepareQuery({
      query: gql`
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
      `,
    })
    .withVariables({ id: article.id })

  await commentQuery.shouldReturnData({
    uuid: { threads: { nodes: [{ archived: false }] } },
  })

  await mutation.shouldReturnData({
    thread: { setThreadArchived: { success: true } },
  })

  await commentQuery.shouldReturnData({
    uuid: { threads: { nodes: [{ archived: true }] } },
  })
})

test('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})
