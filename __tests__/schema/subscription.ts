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

import {
  article,
  getArticleDataWithoutSubResolvers,
  user,
} from '../../__fixtures__'
import {
  assertSuccessfulGraphQLQuery,
  createJsonHandlerForDatabaseLayer,
  createTestClient,
  createUuidHandler,
} from '../__utils__'
import { Service } from '~/internals/auth'

describe('subscriptions', () => {
  beforeEach(() => {
    global.server.use(
      createUuidHandler(article),
      createJsonHandlerForDatabaseLayer({
        path: `/subscriptions/${user.id}`,
        body: {
          userId: user.id,
          subscriptions: [{ id: article.id }],
        },
      })
    )
  })

  function createSubscriptionsQuery() {
    return {
      query: gql`
        query subscriptions {
          subscriptions {
            totalCount
            nodes {
              __typename
              id
              trashed
              ... on Article {
                instance
                date
              }
            }
          }
        }
      `,
    }
  }

  test('Article', async () => {
    const client = createTestClient({
      service: Service.SerloCloudflareWorker,
      userId: 1,
    })
    await assertSuccessfulGraphQLQuery({
      ...createSubscriptionsQuery(),
      data: {
        subscriptions: {
          totalCount: 1,
          nodes: [getArticleDataWithoutSubResolvers(article)],
        },
      },
      client,
    })
  })
})
