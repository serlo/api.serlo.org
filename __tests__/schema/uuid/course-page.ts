import { gql } from 'apollo-server'
import R from 'ramda'

import { course, coursePage, coursePageRevision } from '../../../__fixtures__'
import { getTypenameAndId, given, Client } from '../../__utils__'

describe('CoursePage', () => {
  beforeEach(() => {
    given('UuidQuery').for(coursePage)
  })

  test('by id', async () => {
    given('UuidQuery').for(coursePage)

    await new Client()
      .prepareQuery({
        query: gql`
          query coursePage($id: Int!) {
            uuid(id: $id) {
              __typename
              ... on CoursePage {
                id
                trashed
                instance
                date
              }
            }
          }
        `,
      })
      .withVariables({ id: coursePage.id })
      .shouldReturnData({
        uuid: R.pick(
          ['__typename', 'id', 'trashed', 'instance', 'date'],
          coursePage
        ),
      })
  })

  test('by id (w/ course)', async () => {
    given('UuidQuery').for(course)

    await new Client()
      .prepareQuery({
        query: gql`
          query coursePage($id: Int!) {
            uuid(id: $id) {
              ... on CoursePage {
                course {
                  __typename
                  id
                }
              }
            }
          }
        `,
      })
      .withVariables({ id: coursePage.id })
      .shouldReturnData({ uuid: { course: getTypenameAndId(course) } })
  })

  test('CoursePageRevision', async () => {
    given('UuidQuery').for(coursePageRevision)

    await new Client()
      .prepareQuery({
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
      })
      .withVariables({ id: coursePageRevision.id })
      .shouldReturnData({
        uuid: R.pick(
          [
            '__typename',
            'id',
            'trashed',
            'date',
            'title',
            'content',
            'changes',
          ],
          coursePageRevision
        ),
      })
  })
})
