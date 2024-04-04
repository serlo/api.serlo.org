import gql from 'graphql-tag'
import * as R from 'ramda'

import { user } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'
import { Instance } from '~/types'

const client = new Client()

describe('userByUsername', () => {
  test('with valid username', async () => {
    given('UuidQuery').for(user)
    given('AliasQuery')
      .withPayload({
        instance: Instance.De,
        path: `/user/profile/${user.username}`,
      })
      .returns({
        id: user.id,
        instance: Instance.De,
        path: `/user/${user.id}/${user.username}`,
      })
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
    given('AliasQuery')
      .withPayload({
        instance: Instance.De,
        path: `/user/profile/${user.username}`,
      })
      .returnsNotFound()

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
