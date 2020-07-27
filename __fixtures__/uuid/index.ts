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
import {
  AliasPayload,
  DiscriminatorType,
  EntityRevisionType,
  EntityType,
  NavigationPayload,
  TaxonomyTermPayload,
  UserPayload,
  VideoPayload,
  VideoRevisionPayload,
} from '../../src/graphql/schema'
import { Instance, TaxonomyTermType } from '../../src/types'
import { license } from '../license'

export * from './abstract-entity'
export * from './abstract-taxonomy-term-child'
export * from './abstract-uuid'
export * from './applet'
export * from './article'
export * from './course'
export * from './course-page'
export * from './exercise'
export * from './exercise-group'
export * from './event'
export * from './grouped-exercise'
export * from './page'
export * from './solution'
export * from './taxonomy-term'

export const navigation: NavigationPayload = {
  data: [
    {
      label: 'Mathematik',
      id: 19767,
      children: [
        {
          label: 'Alle Themen',
          id: 5,
        },
      ],
    },
  ],
  instance: Instance.De,
}

export const taxonomyTermRoot: TaxonomyTermPayload = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: 3,
  trashed: false,
  alias: null,
  type: TaxonomyTermType.Root,
  instance: Instance.De,
  name: 'name',
  description: null,
  weight: 1,
  parentId: null,
  childrenIds: [5],
}

export const taxonomyTermSubject: TaxonomyTermPayload = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: 5,
  trashed: false,
  alias: 'alias',
  type: TaxonomyTermType.Subject,
  instance: Instance.De,
  name: 'name',
  description: null,
  weight: 2,
  parentId: taxonomyTermRoot.id,
  childrenIds: [16048],
}

export const user: UserPayload = {
  __typename: DiscriminatorType.User,
  id: 1,
  trashed: false,
  username: 'username',
  date: '2014-03-01T20:36:21Z',
  lastLogin: '2020-03-24T09:40:55Z',
  description: null,
}

export const user2: UserPayload = {
  __typename: DiscriminatorType.User,
  id: 23,
  trashed: false,
  username: 'second user',
  date: '2015-02-01T20:35:21Z',
  lastLogin: '2019-03-23T09:20:55Z',
  description: null,
}

export const video: VideoPayload = {
  __typename: EntityType.Video,
  id: 16078,
  trashed: false,
  instance: Instance.De,
  alias:
    '/mathe/artikel-und-videos-aus-serlo1/waagrechte-und-schiefe-asymptote',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 16114,
  licenseId: license.id,
  taxonomyTermIds: [5],
}

export const videoAlias: AliasPayload = {
  id: 16078,
  instance: Instance.De,
  path: '/mathe/artikel-und-videos-aus-serlo1/waagrechte-und-schiefe-asymptote',
  source: '/entity/view/16078',
  timestamp: '2014-06-16T15:58:45Z',
}

export const videoRevision: VideoRevisionPayload = {
  __typename: EntityRevisionType.VideoRevision,
  id: 16114,
  trashed: false,
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: video.id,
  title: 'title',
  content: 'content',
  url: 'url',
  changes: 'changes',
}
