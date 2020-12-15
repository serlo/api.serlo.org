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
import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'

import {
  coursePage,
  coursePageRevision,
  getCoursePageDataWithoutSubResolvers,
  getCoursePageRevisionDataWithoutSubResolvers,
} from '../../../__fixtures__'
import {
  addUuidInteraction,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'
import { CoursePagePayload, CoursePageRevisionPayload } from '~/schema/uuid'

test('CoursePage', async () => {
  await addUuidInteraction<CoursePagePayload>({
    __typename: coursePage.__typename,
    id: coursePage.id,
    trashed: Matchers.boolean(coursePage.trashed),
    instance: Matchers.string(coursePage.instance),
    alias: coursePage.alias ? Matchers.string(coursePage.alias) : null,
    date: Matchers.iso8601DateTime(coursePage.date),
    currentRevisionId: coursePage.currentRevisionId
      ? Matchers.integer(coursePage.currentRevisionId)
      : null,
    revisionIds: Matchers.eachLike(coursePage.revisionIds[0]),
    licenseId: Matchers.integer(coursePage.licenseId),
    parentId: Matchers.integer(coursePage.parentId),
  })
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
  await addUuidInteraction<CoursePageRevisionPayload>({
    __typename: coursePageRevision.__typename,
    id: coursePageRevision.id,
    trashed: Matchers.boolean(coursePageRevision.trashed),
    date: Matchers.iso8601DateTime(coursePageRevision.date),
    authorId: Matchers.integer(coursePageRevision.authorId),
    repositoryId: Matchers.integer(coursePageRevision.repositoryId),
    title: Matchers.string(coursePageRevision.title),
    content: Matchers.string(coursePageRevision.content),
    changes: Matchers.string(coursePageRevision.changes),
  })
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
