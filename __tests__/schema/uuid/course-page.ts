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
  course,
  coursePage,
  coursePageRevision,
  getCourseDataWithoutSubResolvers,
  getCoursePageDataWithoutSubResolvers,
  getCoursePageRevisionDataWithoutSubResolvers,
} from '../../../__fixtures__'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createTestClient,
  createUuidHandler,
} from '../../__utils__'
import { Service } from '~/internals/auth'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: null,
  })
})

describe('CoursePage', () => {
  beforeEach(() => {
    global.server.use(createUuidHandler(coursePage))
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query coursePage($id: Int!) {
          uuid(id: $id) {
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
      variables: coursePage,
      data: {
        uuid: getCoursePageDataWithoutSubResolvers(coursePage),
      },
      client,
    })
  })

  test('by id (w/ course)', async () => {
    global.server.use(createUuidHandler(course))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query coursePage($id: Int!) {
          uuid(id: $id) {
            ... on CoursePage {
              course {
                __typename
                id
                trashed
                alias
                instance
                date
              }
            }
          }
        }
      `,
      variables: coursePage,
      data: {
        uuid: {
          course: getCourseDataWithoutSubResolvers(course),
        },
      },
      client,
    })
  })
})

test('CoursePageRevision', async () => {
  global.server.use(createUuidHandler(coursePageRevision))
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query coursePageRevision($id: Int!) {
        uuid(id: $id) {
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
    variables: coursePageRevision,
    data: {
      uuid: getCoursePageRevisionDataWithoutSubResolvers(coursePageRevision),
    },
    client,
  })
})
