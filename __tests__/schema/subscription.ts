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
import { rest } from 'msw'

import { article, user } from '../../__fixtures__/uuid'
import { Service } from '../../src/graphql/schema/types'
import {
  assertSuccessfulGraphQLQuery,
  createTestClient,
  createUuidHandler,
} from '../__utils__'

describe('subscriptions', () => {
  beforeEach(() => {
    global.server.use(
      createUuidHandler(article),
      rest.get(
        `http://de.${process.env.SERLO_ORG_HOST}/api/subscriptions/${user.id}`,
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              userId: user.id,
              subscriptions: [{ id: article.id }],
            })
          )
        }
      )
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
                alias
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
    const { client } = createTestClient({
      service: Service.SerloCloudflareWorker,
      user: 1,
    })
    await assertSuccessfulGraphQLQuery({
      ...createSubscriptionsQuery(),
      data: {
        subscriptions: {
          totalCount: 1,
          nodes: [
            {
              __typename: 'Article',
              alias:
                '/mathe/funktionen/uebersicht-aller-artikel-zu-funktionen/parabel',
              date: '2014-03-01T20:45:56Z',
              id: 1855,
              instance: 'de',
              trashed: false,
            },
          ],
        },
      },
      client,
    })
  })
})
