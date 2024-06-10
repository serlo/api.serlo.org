import gql from 'graphql-tag'

import { Client } from '../../__utils__'

const query = new Client().prepareQuery({
  query: gql`
    query user($username: String!) {
      user {
        userByUsername(username: $username) {
          id
        }
      }
    }
  `,
})

test('with valid username', async () => {
  await query.withVariables({ username: 'admin' }).shouldReturnData({
    user: { userByUsername: { id: 1 } },
  })
})

test('with nonexisting username: returns null when user does not exist', async () => {
  await query.withVariables({ username: 'foo' }).shouldReturnData({
    user: { userByUsername: null },
  })
})
