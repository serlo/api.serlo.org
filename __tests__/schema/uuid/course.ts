/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'
import R from 'ramda'

import { course, coursePage, courseRevision } from '../../../__fixtures__'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createTestClient,
  createUuidHandler,
  getTypenameAndId,
} from '../../__utils__'
import { castToUuid } from '~/model/decoder'

let client: Client

beforeEach(() => {
  client = createTestClient()
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
        uuid: R.pick(
          ['__typename', 'id', 'trashed', 'instance', 'date'],
          course
        ),
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
              }
            }
          }
        }
      `,
      variables: course,
      data: {
        uuid: {
          pages: [getTypenameAndId(coursePage)],
        },
      },
      client,
    })
  })

  describe('filter "trashed"', () => {
    const pages = [
      { ...coursePage, id: castToUuid(1), trashed: true },
      { ...coursePage, id: castToUuid(2), trashed: false },
    ]

    beforeEach(() => {
      global.server.use(...pages.map((page) => createUuidHandler(page)))
      global.server.use(
        createUuidHandler({ ...course, pageIds: [1, 2].map(castToUuid) })
      )
    })

    test('when not set', async () => {
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query ($id: Int!) {
            uuid(id: $id) {
              ... on Course {
                pages {
                  id
                }
              }
            }
          }
        `,
        variables: { id: course.id },
        client,
        data: { uuid: { pages: [{ id: 1 }, { id: 2 }] } },
      })
    })

    test('when set to true', async () => {
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query ($id: Int!) {
            uuid(id: $id) {
              ... on Course {
                pages(trashed: true) {
                  id
                }
              }
            }
          }
        `,
        variables: { id: course.id },
        client,
        data: { uuid: { pages: [{ id: 1 }] } },
      })
    })

    test('when set to false', async () => {
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query ($id: Int!) {
            uuid(id: $id) {
              ... on Course {
                pages(trashed: false) {
                  id
                }
              }
            }
          }
        `,
        variables: { id: course.id },
        client,
        data: { uuid: { pages: [{ id: 2 }] } },
      })
    })
  })

  describe('filter "hasCurrentRevision"', () => {
    const pages = [
      { ...coursePage, id: castToUuid(1) },
      { ...coursePage, id: castToUuid(2), currentRevisionId: null },
    ]

    beforeEach(() => {
      global.server.use(...pages.map((page) => createUuidHandler(page)))
      global.server.use(
        createUuidHandler({ ...course, pageIds: [1, 2].map(castToUuid) })
      )
    })

    test('when not set', async () => {
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query ($id: Int!) {
            uuid(id: $id) {
              ... on Course {
                pages {
                  id
                }
              }
            }
          }
        `,
        variables: { id: course.id },
        client,
        data: { uuid: { pages: [{ id: 1 }, { id: 2 }] } },
      })
    })

    test('when set to true', async () => {
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query ($id: Int!) {
            uuid(id: $id) {
              ... on Course {
                pages(hasCurrentRevision: true) {
                  id
                }
              }
            }
          }
        `,
        variables: { id: course.id },
        client,
        data: { uuid: { pages: [{ id: 1 }] } },
      })
    })

    test('when set to false', async () => {
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query ($id: Int!) {
            uuid(id: $id) {
              ... on Course {
                pages(hasCurrentRevision: false) {
                  id
                }
              }
            }
          }
        `,
        variables: { id: course.id },
        client,
        data: { uuid: { pages: [{ id: 2 }] } },
      })
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
      uuid: R.pick(
        [
          '__typename',
          'id',
          'trashed',
          'date',
          'title',
          'content',
          'changes',
          'metaDescription',
        ],
        courseRevision
      ),
    },
    client,
  })
})
