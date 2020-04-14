import { gql } from 'apollo-server'
import * as R from 'ramda'

import { license } from '../../__fixtures__/license'
import {
  course,
  courseRevision,
  coursePage,
  coursePageAlias,
  coursePageRevision,
  user,
} from '../../__fixtures__/uuid'
import { assertSuccessfulGraphQLQuery } from '../__utils__/assertions'
import {
  addAliasInteraction,
  addCoursePageInteraction,
  addCoursePageRevisionInteraction,
  addLicenseInteraction,
  addUserInteraction,
  addCourseRevisionInteraction,
  addCourseInteraction,
} from '../__utils__/interactions'

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
          __typename: 'CoursePage',
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

  test('by alias (w/ license)', async () => {
    await addCoursePageInteraction(coursePage)
    await addAliasInteraction(coursePageAlias)
    await addLicenseInteraction(license)
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
                title
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'CoursePage',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'solutionId', 'parentId'],
            coursePage
          ),
          currentRevision: {
            id: coursePage.currentRevisionId,
          },
          license: {
            id: 1,
            title: 'title',
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
          __typename: 'CoursePage',
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
    await addCourseRevisionInteraction(courseRevision)
    await addCourseInteraction(course)
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
          __typename: 'CoursePage',
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
          __typename: 'CoursePage',
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
          __typename: 'CoursePageRevision',
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

  test('by id (w/ author)', async () => {
    await addCoursePageRevisionInteraction(coursePageRevision)
    await addUserInteraction(user)
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
                username
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
          __typename: 'CoursePageRevision',
          ...R.omit(['authorId', 'repositoryId'], coursePageRevision),
          author: {
            id: 1,
            username: user.username,
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
          __typename: 'CoursePageRevision',
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
