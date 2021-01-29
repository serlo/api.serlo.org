/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'

import {
  article,
  articleRevision,
  getArticleDataWithoutSubResolvers,
  getArticleRevisionDataWithoutSubResolvers,
} from '../../../__fixtures__'
import {
  addUuidInteraction,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'
import { ArticlePayload, ArticleRevisionPayload } from '~/schema/uuid'

test('Article', async () => {
  await addUuidInteraction<ArticlePayload>({
    __typename: article.__typename,
    id: article.id,
    trashed: Matchers.boolean(article.trashed),
    instance: Matchers.string(article.instance),
    alias: Matchers.string(article.alias),
    date: Matchers.iso8601DateTime(article.date),
    currentRevisionId: article.currentRevisionId
      ? Matchers.integer(article.currentRevisionId)
      : null,
    revisionIds: Matchers.eachLike(article.revisionIds[0]),
    licenseId: Matchers.integer(article.licenseId),
    taxonomyTermIds:
      article.taxonomyTermIds.length > 0
        ? Matchers.eachLike(Matchers.like(article.taxonomyTermIds[0]))
        : [],
  })
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
  })
})

test('ArticleRevision', async () => {
  await addUuidInteraction<ArticleRevisionPayload>({
    __typename: articleRevision.__typename,
    id: articleRevision.id,
    trashed: Matchers.boolean(articleRevision.trashed),
    alias: Matchers.string(articleRevision.alias),
    date: Matchers.iso8601DateTime(articleRevision.date),
    authorId: Matchers.integer(articleRevision.authorId),
    repositoryId: Matchers.integer(articleRevision.repositoryId),
    title: Matchers.string(articleRevision.title),
    content: Matchers.string(articleRevision.content),
    changes: Matchers.string(articleRevision.changes),
    metaTitle: Matchers.string(articleRevision.metaTitle),
    metaDescription: Matchers.string(articleRevision.metaDescription),
  })
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
  })
})
