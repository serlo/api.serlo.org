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
import { Model } from '~/internals/graphql'
import {
  EntityRevisionType,
  EntityType,
} from '~/schema/uuid/abstract-entity/types'
import { Instance } from '~/types'

export const video: Model<'Video'> = {
  __typename: EntityType.Video,
  id: 16078,
  trashed: false,
  instance: Instance.De,
  alias: '/mathe/16078/waagrechte-und-schiefe-asymptote',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 16114,
  revisionIds: [16114],
  licenseId: license.id,
  taxonomyTermIds: [5],
}

export const videoRevision: Model<'VideoRevision'> = {
  __typename: EntityRevisionType.VideoRevision,
  id: 16114,
  trashed: false,
  alias: '/mathe/16114/waagrechte-und-schiefe-asymptote',
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: video.id,
  title: 'title',
  content: 'content',
  url: 'url',
  changes: 'changes',
}

export function getVideoDataWithoutSubResolvers(video: Model<'Video'>) {
  return R.omit(
    [
      'currentRevisionId',
      'revisionIds',
      'licenseId',
      'taxonomyTermIds',
      'alias',
    ],
    video
  )
}

export function getVideoRevisionDataWithoutSubResolvers(
  videoRevision: Model<'VideoRevision'>
) {
  return R.omit(['authorId', 'repositoryId', 'alias'], videoRevision)
}
