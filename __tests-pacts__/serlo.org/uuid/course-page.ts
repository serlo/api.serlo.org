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
import { gql } from 'apollo-server'

import {
  coursePage,
  coursePageRevision,
  getCoursePageDataWithoutSubResolvers,
  getCoursePageRevisionDataWithoutSubResolvers,
} from '../../../__fixtures__'
import {
  addCoursePageInteraction,
  addCoursePageRevisionInteraction,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'

test('CoursePage', async () => {
  await addCoursePageInteraction(coursePage)
  await assertSuccessfulGraphQLQuery({
    query: gql`
        {
          uuid(id: ${coursePage.id}) {
            __typename
            ... on CoursePage {
              id
              trashed
              alias
              instance
              date
            }
          }
        }
      `,
    data: {
      uuid: getCoursePageDataWithoutSubResolvers(coursePage),
    },
  })
})

test('CoursePageRevision', async () => {
  await addCoursePageRevisionInteraction(coursePageRevision)
  await assertSuccessfulGraphQLQuery({
    query: gql`
        {
          uuid(id: ${coursePage.currentRevisionId}) {
            __typename
            ... on CoursePageRevision {
              id
              trashed
              date
              title
              content
              changes
            }
          }
        }
      `,
    data: {
      uuid: getCoursePageRevisionDataWithoutSubResolvers(coursePageRevision),
    },
  })
})
