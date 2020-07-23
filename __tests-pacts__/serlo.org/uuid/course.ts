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
import * as R from 'ramda'

import {
  course,
  courseAlias,
  coursePage,
  coursePageRevision,
  courseRevision,
} from '../../../__fixtures__'
import { assertSuccessfulGraphQLQuery } from '../../__utils__/assertions'
import {
  addAliasInteraction,
  addCourseInteraction,
  addCoursePageInteraction,
  addCoursePageRevisionInteraction,
  addCourseRevisionInteraction,
} from '../../__utils__/interactions'

describe('Course', () => {
  test('by alias', async () => {
    await addCourseInteraction(course)
    await addAliasInteraction(courseAlias)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${courseAlias.path}"
              }
            ) {
              __typename
              ... on Course {
                id
                trashed
                instance
                alias
                date
                currentRevision {
                  id
                }
                license {
                  id
                }
              }
            }
          }
        `,
      data: {
        uuid: {
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds', 'pageIds'],
            course
          ),
          currentRevision: {
            id: course.currentRevisionId,
          },
          license: {
            id: 1,
          },
        },
      },
    })
  })

  test('by alias (w/ currentRevision)', async () => {
    await addCourseInteraction(course)
    await addAliasInteraction(courseAlias)
    await addCourseRevisionInteraction(courseRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${courseAlias.path}"
              }
            ) {
              __typename
              ... on Course {
                id
                trashed
                instance
                alias
                date
                currentRevision {
                  id
                  content
                  changes
                }
              }
            }
          }
        `,
      data: {
        uuid: {
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds', 'pageIds'],
            course
          ),
          currentRevision: {
            id: course.currentRevisionId,
            content: 'content',
            changes: 'changes',
          },
        },
      },
    })
  })

  test('by alias (w/ pages)', async () => {
    await addCourseInteraction(course)
    await addAliasInteraction(courseAlias)
    await addCoursePageRevisionInteraction(coursePageRevision)
    await addCoursePageInteraction(coursePage)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(
            alias: {
              instance: de
              path: "${courseAlias.path}"
            }
          ) {
            __typename
            ... on Course {
              id
              trashed
              instance
              alias
              date
              pages {
                id
                currentRevision {
                  id
                  content
                  changes
                }
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds', 'pageIds'],
            course
          ),
          pages: [
            {
              id: coursePage.id,
              currentRevision: {
                id: coursePageRevision.id,
                content: coursePageRevision.content,
                changes: coursePageRevision.changes,
              },
            },
          ],
        },
      },
    })
  })

  test('by id', async () => {
    await addCourseInteraction(course)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${course.id}) {
            __typename
            ... on Course {
              id
              trashed
              alias
              instance
              date
              currentRevision {
                id
              }
              license {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds', 'pageIds'],
            course
          ),
          currentRevision: {
            id: course.currentRevisionId,
          },
          license: {
            id: 1,
          },
        },
      },
    })
  })
})

describe('CourseRevision', () => {
  test('by id', async () => {
    await addCourseRevisionInteraction(courseRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${course.currentRevisionId}) {
            __typename
            ... on CourseRevision {
              id
              trashed
              date
              title
              content
              changes
              metaDescription
              author {
                id
              }
              course {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          ...R.omit(['authorId', 'repositoryId'], courseRevision),
          author: {
            id: 1,
          },
          course: {
            id: course.id,
          },
        },
      },
    })
  })

  test('by id (w/ course)', async () => {
    await addCourseRevisionInteraction(courseRevision)
    await addCourseInteraction(course)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${course.currentRevisionId}) {
            __typename
            ... on CourseRevision {
              id
              trashed
              date
              title
              content
              changes
              metaDescription
              author {
                id
              }
              course {
                id
                currentRevision {
                  id
                }
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          ...R.omit(['authorId', 'repositoryId'], courseRevision),
          author: {
            id: 1,
          },
          course: {
            id: course.id,
            currentRevision: {
              id: course.currentRevisionId,
            },
          },
        },
      },
    })
  })
})
