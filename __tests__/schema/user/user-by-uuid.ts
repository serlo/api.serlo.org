import gql from 'graphql-tag'
import * as R from 'ramda'

import { user } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'

const client = new Client()

beforeEach(() => {
  given('UuidQuery').for(user)
})

describe('userByUuid', () => {
  test('with valid id', async () => {
    await client
      .prepareQuery({
        query: gql`
          query user($id: Int!) {
            user {
              userByUuid(id: $id) {
                __typename
                ... on User {
                  id
                  trashed
                  username
                  date
                  description
                }
              }
            }
          }
        `,
      })
      .withVariables({ id: user.id })
      .shouldReturnData({
        uuid: R.pick(
          ['__typename', 'id', 'trashed', 'username', 'date', 'description'],
          user,
        ),
      })
  })

  test('with nonexisting user id: returns null when user does not exist', async () => {
    given('UuidQuery').withPayload({ id: user.id }).returnsNotFound()

    await client
      .prepareQuery({
        query: gql`
          query user($id: Int!) {
            user {
              userByUuid(id: $id) {
                __typename
              }
            }
          }
        `,
      })
      .withVariables({ id: user.id })
      .shouldReturnData({ uuid: null })
  })
})
