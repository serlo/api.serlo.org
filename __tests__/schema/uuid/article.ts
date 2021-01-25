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
  articleRevision,
  getArticleDataWithoutSubResolvers,
  getArticleRevisionDataWithoutSubResolvers,
} from '../../../__fixtures__'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createTestClient,
  createUuidHandler,
} from '../../__utils__'

let client: Client

beforeEach(() => {
  client = createTestClient()
})

test('Article', async () => {
  global.server.use(createUuidHandler(article))
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query article($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on Article {
            id
            trashed
            instance
            date
          }
        }
      }
    `,
    variables: article,
    data: {
      uuid: getArticleDataWithoutSubResolvers(article),
    },
    client,
  })
})

test('ArticleRevision', async () => {
  global.server.use(createUuidHandler(articleRevision))
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query articleRevision($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on ArticleRevision {
            id
            trashed
            date
            title
            content
            changes
            metaTitle
            metaDescription
          }
        }
      }
    `,
    variables: articleRevision,
    data: {
      uuid: getArticleRevisionDataWithoutSubResolvers(articleRevision),
    },
    client,
  })
})
