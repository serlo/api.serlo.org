import gql from 'graphql-tag'
import R from 'ramda'

import { course, coursePage, courseRevision } from '../../../__fixtures__'
import { getTypenameAndId, given, Client } from '../../__utils__'
import { castToUuid } from '~/model/decoder'

describe('Course', () => {
  beforeEach(() => {
    given('UuidQuery').for(course)
  })

  test('by id', async () => {
    await new Client()
      .prepareQuery({
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
      })
      .withVariables(course)
      .shouldReturnData({
        uuid: R.pick(
          ['__typename', 'id', 'trashed', 'instance', 'date'],
          course,
        ),
      })
  })

  test('by id (w/ pages)', async () => {
    given('UuidQuery').for(coursePage)

    await new Client()
      .prepareQuery({
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
      })
      .withVariables(course)
      .shouldReturnData({ uuid: { pages: [getTypenameAndId(coursePage)] } })
  })

  describe('filter "trashed"', () => {
    const pages = [
      { ...coursePage, id: castToUuid(1), trashed: true },
      { ...coursePage, id: castToUuid(2), trashed: false },
    ]
    const courseWithTwoPages = { ...course, pageIds: [1, 2].map(castToUuid) }

    beforeEach(() => {
      given('UuidQuery').for(pages, courseWithTwoPages)
    })

    test('when not set', async () => {
      await new Client()
        .prepareQuery({
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
        })
        .withVariables({ id: courseWithTwoPages.id })
        .shouldReturnData({ uuid: { pages: [{ id: 1 }, { id: 2 }] } })
    })

    test('when set to true', async () => {
      await new Client()
        .prepareQuery({
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
        })
        .withVariables({ id: courseWithTwoPages.id })
        .shouldReturnData({ uuid: { pages: [{ id: 1 }] } })
    })

    test('when set to false', async () => {
      await new Client()
        .prepareQuery({
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
        })
        .withVariables({ id: courseWithTwoPages.id })
        .shouldReturnData({ uuid: { pages: [{ id: 2 }] } })
    })
  })

  describe('filter "hasCurrentRevision"', () => {
    const pages = [
      { ...coursePage, id: castToUuid(1) },
      { ...coursePage, id: castToUuid(2), currentRevisionId: null },
    ]
    const courseWithTwoPages = { ...course, pageIds: [1, 2].map(castToUuid) }

    beforeEach(() => {
      given('UuidQuery').for(pages, courseWithTwoPages)
    })

    test('when not set', async () => {
      await new Client()
        .prepareQuery({
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
        })
        .withVariables({ id: course.id })
        .shouldReturnData({ uuid: { pages: [{ id: 1 }, { id: 2 }] } })
    })

    test('when set to true', async () => {
      await new Client()
        .prepareQuery({
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
        })
        .withVariables({ id: course.id })
        .shouldReturnData({ uuid: { pages: [{ id: 1 }] } })
    })

    test('when set to false', async () => {
      await new Client()
        .prepareQuery({
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
        })
        .withVariables({ id: course.id })
        .shouldReturnData({ uuid: { pages: [{ id: 2 }] } })
    })
  })
})

test('CourseRevision', async () => {
  given('UuidQuery').for(courseRevision)

  await new Client()
    .prepareQuery({
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
    })
    .withVariables(courseRevision)
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
          'metaDescription',
        ],
        courseRevision,
      ),
    })
})
