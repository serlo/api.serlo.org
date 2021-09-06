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
import { license } from '../license'
import { course } from './course'
import { user } from './user'
import { Model } from '~/internals/graphql'
import {
  castToAlias,
  castToUuid,
  EntityRevisionType,
  EntityType,
} from '~/model/decoder'
import { Instance } from '~/types'

export const coursePage: Model<'CoursePage'> = {
  __typename: EntityType.CoursePage,
  id: castToUuid(18521),
  trashed: false,
  instance: Instance.De,
  alias: castToAlias('/mathe/18521/startseite'),
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: castToUuid(19277),
  revisionIds: [19277].map(castToUuid),
  licenseId: license.id,
  parentId: course.id,
  canonicalSubjectId: castToUuid(5),
}

export const coursePageRevision: Model<'CoursePageRevision'> = {
  __typename: EntityRevisionType.CoursePageRevision,
  id: castToUuid(19277),
  trashed: false,
  alias: castToAlias('/mathe/19277/startseite'),
  date: '2014-09-15T15:28:35Z',
  authorId: user.id,
  repositoryId: coursePage.id,
  title: 'title',
  content: 'content',
  changes: 'changes',
}
