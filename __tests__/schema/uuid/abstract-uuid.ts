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
import gql from 'graphql-tag'

import {
  article,
  getArticleDataWithoutSubResolvers,
} from '../../../__fixtures__'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createJsonHandler,
  createTestClient,
  createUuidHandler,
} from '../../__utils__'
import { Service } from '~/internals/auth'
import { Instance } from '~/types'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: null,
  })
})

test('alias path /entity/view/:id returns article data', async () => {
  global.server.use(createUuidHandler(article))
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query uuid($alias: AliasInput!) {
        uuid(alias: $alias) {
          __typename
          ... on Article {
            id
            trashed
            alias
            instance
            date
          }
        }
      }
    `,
    variables: {
      alias: {
        instance: Instance.De,
        path: `/entity/view/${article.id}`,
      },
    },
    data: {
      uuid: getArticleDataWithoutSubResolvers(article),
    },
    client,
  })
})

test('alias path /entity/view/:id returns null when id does not exist', async () => {
  global.server.use(
    createJsonHandler({
      path: `/api/uuid/${article.id}`,
      body: null,
    })
  )
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query uuid($alias: AliasInput!) {
        uuid(alias: $alias) {
          __typename
        }
      }
    `,
    variables: {
      alias: {
        instance: Instance.De,
        path: `/entity/view/${article.id}`,
      },
    },
    data: {
      uuid: null,
    },
    client,
  })
})
