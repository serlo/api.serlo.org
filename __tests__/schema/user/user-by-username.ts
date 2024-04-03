import gql from 'graphql-tag'
import * as R from 'ramda'

import { user } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'

const client = new Client()

beforeEach(() => {
  given('UuidQuery').for(user)
})

describe('userByUsername', () => {
  test('with valid username', async () => {
    await client
      .prepareQuery({
        query: gql`
          query user($username: String!) {
            user {
              userByUsername(username: $username) {
                __typename
                id
                trashed
                username
                date
                description
              }
            }
          }
        `,
      })
      .withVariables({ username: user.username })
      .shouldReturnData({
        user: {
          userByUsername: R.pick(
            ['__typename', 'id', 'trashed', 'username', 'date', 'description'],
            user,
          ),
        },
      })
  })

  test('with nonexisting username: returns null when user does not exist', async () => {
    given('UuidQuery').withPayload({ id: user.id }).returnsNotFound()

    await client
      .prepareQuery({
        query: gql`
          query user($username: String!) {
            user {
              userByUsername(username: $username) {
                __typename
              }
            }
          }
        `,
      })
      .withVariables({ username: user.username })
      .shouldReturnData({ user: { userByUsername: null } })
  })
})
