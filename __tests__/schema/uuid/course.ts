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
  courseRevision,
  getCourseDataWithoutSubResolvers,
  getCoursePageDataWithoutSubResolvers,
  getCourseRevisionDataWithoutSubResolvers,
} from '../../../__fixtures__'
import { Service } from '../../../src/graphql/schema/types'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createTestClient,
  createUuidHandler,
} from '../../__utils__'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: null,
  }).client
})

describe('Course', () => {
  beforeEach(() => {
    global.server.use(createUuidHandler(course))
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query course($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on Course {
              id
              trashed
              instance
              date
            }
          }
        }
      `,
      variables: course,
      data: {
        uuid: getCourseDataWithoutSubResolvers(course),
      },
      client,
    })
  })

  test('by id (w/ pages)', async () => {
    global.server.use(createUuidHandler(coursePage))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query course($id: Int!) {
          uuid(id: $id) {
            ... on Course {
              pages {
                __typename
                id
                trashed
                instance
                date
              }
            }
          }
        }
      `,
      variables: course,
      data: {
        uuid: {
          pages: [getCoursePageDataWithoutSubResolvers(coursePage)],
        },
      },
      client,
    })
  })
})

test('CourseRevision', async () => {
  global.server.use(createUuidHandler(courseRevision))
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query courseRevision($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on CourseRevision {
            id
            trashed
            date
            title
            content
            changes
            metaDescription
          }
        }
      }
    `,
    variables: courseRevision,
    data: {
      uuid: getCourseRevisionDataWithoutSubResolvers(courseRevision),
    },
    client,
  })
})
