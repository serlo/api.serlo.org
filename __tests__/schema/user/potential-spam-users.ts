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

import { user, user2 } from '../../../__fixtures__'
import { getTypenameAndId, given, Client } from '../../__utils__'

const query = new Client()
  .prepareQuery({
    query: gql`
      query ($first: Int, $after: String) {
        user {
          potentialSpamUsers(first: $first, after: $after) {
            nodes {
              id
              __typename
            }
          }
        }
      }
    `,
  })
  .withVariables({ first: 100, after: null as string | null })

beforeEach(() => {
  given('UuidQuery').for(user, user2)
  given('UserPotentialSpamUsersQuery')
    .withPayload({ first: 101, after: null })
    .returns({ userIds: [user.id, user2.id] })
  given('UserPotentialSpamUsersQuery')
    .withPayload({ first: 101, after: user.id })
    .returns({ userIds: [user2.id] })
})

describe('endpoint user.potentialSpamUsers', () => {
  test('without parameter `after`', async () => {
    const nodes = [getTypenameAndId(user), getTypenameAndId(user2)]
    await query.shouldReturnData({ user: { potentialSpamUsers: { nodes } } })
  })

  test('with paramater `after`', async () => {
    await query
      .withVariables({
        first: 100,
        after: Buffer.from(user.id.toString()).toString('base64'),
      })
      .shouldReturnData({
        user: { potentialSpamUsers: { nodes: [getTypenameAndId(user2)] } },
      })
  })

  test('fails when `first` is bigger then 500', async () => {
    await query
      .withVariables({ first: 501, after: null })
      .shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when `after` is not a valid id', async () => {
    await query
      .withVariables({ first: 100, after: 'foo' })
      .shouldFailWithError('BAD_USER_INPUT')
  })
})
