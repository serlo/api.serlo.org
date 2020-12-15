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

import { license } from '../license'
import {
  CoursePayload,
  CourseRevisionPayload,
  EntityRevisionType,
  EntityType,
} from '~/schema/uuid'
import { Instance } from '~/types'

export const course: CoursePayload = {
  __typename: EntityType.Course,
  id: 18514,
  trashed: false,
  instance: Instance.De,
  alias:
    '/mathe/geometrie/satzgruppe-des-pythagoras/ueberblick-zum-satz-des-pythagoras',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 30713,
  revisionIds: [30713],
  licenseId: license.id,
  taxonomyTermIds: [5],
  pageIds: [18521],
}

export const courseRevision: CourseRevisionPayload = {
  __typename: EntityRevisionType.CourseRevision,
  id: 30713,
  trashed: false,
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: course.id,
  title: 'title',
  content: 'content',
  changes: 'changes',
  metaDescription: 'metaDescription',
}

export function getCourseDataWithoutSubResolvers(course: CoursePayload) {
  return R.omit(
    [
      'currentRevisionId',
      'revisionIds',
      'licenseId',
      'taxonomyTermIds',
      'pageIds',
    ],
    course
  )
}

export function getCourseRevisionDataWithoutSubResolvers(
  courseRevision: CourseRevisionPayload
) {
  return R.omit(['authorId', 'repositoryId'], courseRevision)
}
