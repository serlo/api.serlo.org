import { gql } from 'apollo-server'
import * as R from 'ramda'

import { license } from '../../__fixtures__/license'
import {
  course,
  courseAlias,
  coursePage,
  coursePageRevision,
  courseRevision,
  taxonomyTermSubject,
  user,
} from '../../__fixtures__/uuid'
import { assertSuccessfulGraphQLQuery } from '../__utils__/assertions'
import {
  addAliasInteraction,
  addCourseInteraction,
  addCoursePageInteraction,
  addCoursePageRevisionInteraction,
  addCourseRevisionInteraction,
  addLicenseInteraction,
  addTaxonomyTermInteraction,
  addUserInteraction,
} from '../__utils__/interactions'

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
          __typename: 'Course',
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

  test('by alias (w/ license)', async () => {
    await addCourseInteraction(course)
    await addAliasInteraction(courseAlias)
    await addLicenseInteraction(license)
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
                title
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'Course',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds', 'pageIds'],
            course
          ),
          currentRevision: {
            id: course.currentRevisionId,
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
          __typename: 'Course',
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

  test('by alias (w/ taxonomyTerms)', async () => {
    await addCourseInteraction(course)
    await addAliasInteraction(courseAlias)
    await addTaxonomyTermInteraction(taxonomyTermSubject)
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
              taxonomyTerms {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'Course',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds', 'pageIds'],
            course
          ),
          taxonomyTerms: [{ id: 5 }],
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
          __typename: 'Course',
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
          __typename: 'Course',
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
          __typename: 'CourseRevision',
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

  test('by id (w/ author)', async () => {
    await addCourseRevisionInteraction(courseRevision)
    await addUserInteraction(user)
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
                username
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
          __typename: 'CourseRevision',
          ...R.omit(['authorId', 'repositoryId'], courseRevision),
          author: {
            id: 1,
            username: user.username,
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
          __typename: 'CourseRevision',
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
