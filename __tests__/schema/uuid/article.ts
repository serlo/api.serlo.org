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
import R from 'ramda'

import { article, articleRevision } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'

test('Article', async () => {
  given('UuidQuery').for(article)

  await new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on Article {
              __typename
              id
              instance
              alias
              trashed
              date
            }
          }
        }
      `,
      variables: { id: article.id },
    })
    .shouldReturnData({
      uuid: R.pick(
        ['id', '__typename', 'instance', 'alias', 'trashed', 'date'],
        article
      ),
    })
})

test('ArticleRevision', async () => {
  given('UuidQuery').for(articleRevision)

  await new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on ArticleRevision {
              __typename
              id
              trashed
              alias
              title
              content
              changes
              metaTitle
              metaDescription
            }
          }
        }
      `,
      variables: { id: articleRevision.id },
    })
    .shouldReturnData({
      uuid: R.pick(
        [
          'id',
          '__typename',
          'trashed',
          'alias',
          'title',
          'content',
          'changes',
          'metaTitle',
          'metaDescription',
        ],
        articleRevision
      ),
    })
})
