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
import { env } from 'process'

import { user, user2, article } from '../../../__fixtures__/uuid'
import { assertSuccessfulGraphQLQuery } from '../../__utils__/assertions'
import {
  addUserInteraction,
  addActiveDonorIds,
  addArticleInteraction,
} from '../../__utils__/interactions'

test('by id', async () => {
  await addUserInteraction(user)
  await assertSuccessfulGraphQLQuery({
    query: gql`
      {
        uuid(id: 1) {
          __typename
          ... on User {
            id
            trashed
            username
            date
            lastLogin
            description
          }
        }
      }
    `,
    data: {
      uuid: {
        __typename: 'User',
        ...user,
      },
    },
  })
})

describe('endpoint activeDonors', () => {
  beforeEach(() => {
    env.GOOGLE_API_KEY = 'my-secret'
    env.ACTIVE_DONORS_SPREADSHEET_ID = 'active-donors'
  })

  test('returns a list of active donors', async () => {
    const user1 = user

    await addUserInteraction(user1)
    await addUserInteraction(user2)
    addActiveDonorIds({
      ids: [user1.id, user2.id],
      spreadsheetId: 'active-donors',
      apiKey: 'my-secret',
    })

    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          activeDonors {
            id
            username
          }
        }
      `,
      data: {
        activeDonors: [
          { id: user1.id, username: user1.username },
          { id: user2.id, username: user2.username },
        ],
      },
    })
  })

  test('filter all uuids which are not users', async () => {
    await addUserInteraction(user)
    await addArticleInteraction(article)
    addActiveDonorIds({
      ids: [user.id, article.id],
      spreadsheetId: 'active-donors',
      apiKey: 'my-secret',
    })

    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          activeDonors {
            id
            username
          }
        }
      `,
      data: {
        activeDonors: [{ id: user.id, username: user.username }],
      },
    })
  })
})
