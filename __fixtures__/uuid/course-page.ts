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
import * as R from 'ramda'

import {
  CoursePagePayload,
  CoursePageRevisionPayload,
  EntityRevisionType,
  EntityType,
} from '../../src/graphql/schema'
import { Instance } from '../../src/types'
import { license } from '../license'
import { course } from './course'

export const coursePage: CoursePagePayload = {
  __typename: EntityType.CoursePage,
  id: 18521,
  trashed: false,
  instance: Instance.De,
  alias: '/18521/formel',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 19277,
  revisionIds: [19277],
  licenseId: license.id,
  parentId: course.id,
}

export const coursePageRevision: CoursePageRevisionPayload = {
  __typename: EntityRevisionType.CoursePageRevision,
  id: 19277,
  trashed: false,
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: coursePage.id,
  title: 'title',
  content: 'content',
  changes: 'changes',
}

export function getCoursePageDataWithoutSubResolvers(
  coursePage: CoursePagePayload
) {
  return R.omit(
    ['currentRevisionId', 'revisionIds', 'licenseId', 'parentId'],
    coursePage
  )
}

export function getCoursePageRevisionDataWithoutSubResolvers(
  coursePageRevision: CoursePageRevisionPayload
) {
  return R.omit(['authorId', 'repositoryId'], coursePageRevision)
}
