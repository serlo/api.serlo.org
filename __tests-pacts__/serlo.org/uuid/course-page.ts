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
import * as R from 'ramda'

import {
  course,
  coursePage,
  coursePageAlias,
  coursePageRevision,
  courseRevision,
} from '../../../__fixtures__'
import {
  CoursePayload,
  CourseRevisionPayload,
} from '../../../src/graphql/schema/uuid/course'
import {
  addAliasInteraction,
  addCoursePageInteraction,
  addCoursePageRevisionInteraction,
  addUuidInteraction,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'

describe('CoursePage', () => {
  test('by alias', async () => {
    await addCoursePageInteraction(coursePage)
    await addAliasInteraction(coursePageAlias)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${coursePageAlias.path}"
              }
            ) {
              __typename
              ... on CoursePage {
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
            ['currentRevisionId', 'licenseId', 'solutionId', 'parentId'],
            coursePage
          ),
          currentRevision: {
            id: coursePage.currentRevisionId,
          },
          license: {
            id: 1,
          },
        },
      },
    })
  })

  test('by alias (w/ currentRevision)', async () => {
    await addCoursePageInteraction(coursePage)
    await addAliasInteraction(coursePageAlias)
    await addCoursePageRevisionInteraction(coursePageRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${coursePageAlias.path}"
              }
            ) {
              __typename
              ... on CoursePage {
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
            ['currentRevisionId', 'licenseId', 'solutionId', 'parentId'],
            coursePage
          ),
          currentRevision: {
            id: coursePage.currentRevisionId,
            content: 'content',
            changes: 'changes',
          },
        },
      },
    })
  })

  test('by alias (w/ course)', async () => {
    await addCoursePageInteraction(coursePage)
    await addAliasInteraction(coursePageAlias)
    await addUuidInteraction<CourseRevisionPayload>({
      __typename: courseRevision.__typename,
      id: courseRevision.id,
      trashed: Matchers.boolean(courseRevision.trashed),
      date: Matchers.iso8601DateTime(courseRevision.date),
      authorId: Matchers.integer(courseRevision.authorId),
      repositoryId: Matchers.integer(courseRevision.repositoryId),
      title: Matchers.string(courseRevision.title),
      content: Matchers.string(courseRevision.content),
      changes: Matchers.string(courseRevision.changes),
      metaDescription: Matchers.string(courseRevision.metaDescription),
    })
    await addUuidInteraction<CoursePayload>({
      __typename: course.__typename,
      id: course.id,
      trashed: Matchers.boolean(course.trashed),
      instance: Matchers.string(course.instance),
      alias: course.alias ? Matchers.string(course.alias) : null,
      date: Matchers.iso8601DateTime(course.date),
      currentRevisionId: course.currentRevisionId
        ? Matchers.integer(course.currentRevisionId)
        : null,
      licenseId: Matchers.integer(course.licenseId),
      taxonomyTermIds:
        course.taxonomyTermIds.length > 0
          ? Matchers.eachLike(Matchers.like(course.taxonomyTermIds[0]))
          : [],
      pageIds:
        course.pageIds.length > 0
          ? Matchers.eachLike(Matchers.like(course.pageIds[0]))
          : [],
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${coursePageAlias.path}"
              }
            ) {
              __typename
              ... on CoursePage {
                id
                trashed
                instance
                alias
                date
                course {
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
            ['currentRevisionId', 'licenseId', 'solutionId', 'parentId'],
            coursePage
          ),
          course: {
            id: course.id,
            currentRevision: {
              id: courseRevision.id,
              content: 'content',
              changes: 'changes',
            },
          },
        },
      },
    })
  })

  test('by id', async () => {
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
            ['currentRevisionId', 'licenseId', 'solutionId', 'parentId'],
            coursePage
          ),
          currentRevision: {
            id: coursePage.currentRevisionId,
          },
          license: {
            id: 1,
          },
        },
      },
    })
  })
})

describe('CoursePageRevision', () => {
  test('by id', async () => {
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
              author {
                id
              }
              coursePage {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          ...R.omit(['authorId', 'repositoryId'], coursePageRevision),
          author: {
            id: 1,
          },
          coursePage: {
            id: coursePage.id,
          },
        },
      },
    })
  })

  test('by id (w/ coursePage)', async () => {
    await addCoursePageRevisionInteraction(coursePageRevision)
    await addCoursePageInteraction(coursePage)
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
              author {
                id
              }
              coursePage {
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
          ...R.omit(['authorId', 'repositoryId'], coursePageRevision),
          author: {
            id: 1,
          },
          coursePage: {
            id: coursePage.id,
            currentRevision: {
              id: coursePage.currentRevisionId,
            },
          },
        },
      },
    })
  })
})
