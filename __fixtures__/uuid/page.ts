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
import { DiscriminatorType } from '~/schema/uuid/abstract-uuid/types'
import { PagePayload, PageRevisionPayload } from '~/schema/uuid/page/types'
import { Instance } from '~/types'

export const page: PagePayload = {
  __typename: DiscriminatorType.Page,
  id: 19767,
  trashed: false,
  instance: Instance.De,
  alias: '/19767/mathematik-startseite',
  date: '2015-02-28T02:06:40Z',
  currentRevisionId: 35476,
  revisionIds: [35476],
  licenseId: license.id,
}

export const pageRevision: PageRevisionPayload = {
  __typename: DiscriminatorType.PageRevision,
  id: 35476,
  trashed: false,
  alias: '/35476/mathematik-startseite',
  title: 'title',
  content: 'content',
  date: '2015-02-28T02:06:40Z',
  authorId: 1,
  repositoryId: page.id,
}

export function getPageDataWithoutSubResolvers(page: PagePayload) {
  return R.omit(
    [
      'currentRevisionId',
      'revisionIds',
      'licenseId',
      'taxonomyTermIds',
      'alias',
    ],
    page
  )
}

export function getPageRevisionDataWithoutSubResolvers(
  pageRevision: PageRevisionPayload
) {
  return R.omit(['authorId', 'repositoryId', 'alias'], pageRevision)
}
