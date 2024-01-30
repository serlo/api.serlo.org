import gql from 'graphql-tag'
import * as R from 'ramda'

import { page, pageRevision, license } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'

describe('Page', () => {
  beforeEach(() => {
    given('UuidQuery').for(page)
  })

  test('by id', async () => {
    await new Client()
      .prepareQuery({
        query: gql`
          query page($id: Int!) {
            uuid(id: $id) {
              __typename
              ... on Page {
                id
                trashed
                instance
                date
              }
            }
          }
        `,
      })
      .withVariables(page)
      .shouldReturnData({
        uuid: R.pick(['__typename', 'id', 'trashed', 'instance', 'date'], page),
      })
  })

  test('by id (w/ license)', async () => {
    await new Client()
      .prepareQuery({
        query: gql`
          query page($id: Int!) {
            uuid(id: $id) {
              ... on Page {
                license {
                  id
                }
              }
            }
          }
        `,
      })
      .withVariables(page)
      .shouldReturnData({ uuid: { license } })
  })
})

test('PageRevision', async () => {
  given('UuidQuery').for(pageRevision)

  await new Client()
    .prepareQuery({
      query: gql`
        query pageRevision($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on PageRevision {
              id
              trashed
              title
              content
              date
            }
          }
        }
      `,
    })
    .withVariables(pageRevision)
    .shouldReturnData({
      uuid: R.pick(
        ['__typename', 'id', 'trashed', 'title', 'content', 'date'],
        pageRevision,
      ),
    })
})
