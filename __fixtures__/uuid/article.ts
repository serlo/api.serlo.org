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
import * as R from 'ramda'

import { license } from '../license'
import { getRepositoryDataWithoutSubResolvers } from './abstract-repository'
import {
  EntityRevisionType,
  EntityType,
} from '~/schema/uuid/abstract-entity/types'
import {
  ArticlePayload,
  ArticleRevisionPayload,
} from '~/schema/uuid/article/types'
import { Instance } from '~/types'

export const article: ArticlePayload = {
  __typename: EntityType.Article,
  id: 1855,
  trashed: false,
  instance: Instance.De,
  alias: '/mathe/1855/parabel',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 30674,
  licenseId: license.id,
  taxonomyTermIds: [5],
  revisionIds: [30674],
}

export const articleRevision: ArticleRevisionPayload = {
  __typename: EntityRevisionType.ArticleRevision,
  id: 30674,
  trashed: false,
  alias: '/mathe/30674/parabel',
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: article.id,
  title: 'title',
  content: 'content',
  changes: 'changes',
  metaDescription: 'metaDescription',
  metaTitle: 'metaTitle',
}

export function getArticleDataWithoutSubResolvers(article: ArticlePayload) {
  return {
    ...R.omit(
      [
        'currentRevisionId',
        'revisionIds',
        'licenseId',
        'taxonomyTermIds',
        'alias',
      ],
      article
    ),
    ...getRepositoryDataWithoutSubResolvers(article),
  }
}

export function getArticleRevisionDataWithoutSubResolvers(
  articleRevision: ArticleRevisionPayload
) {
  return R.omit(['authorId', 'repositoryId', 'alias'], articleRevision)
}
