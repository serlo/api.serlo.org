import { gql } from 'apollo-server'

import { user } from '../../__fixtures__/uuid'
import { assertSuccessfulGraphQLQuery } from '../__utils__/assertions'
import { addUserInteraction } from '../__utils__/interactions'

test('by id', async () => {
  await addUserInteraction(user)
  await assertSuccessfulGraphQLQuery({
    query: gql`
      {
        uuid(id: 1) {
          __typename
          ... on User {
            id
            trashed
            username
            date
            lastLogin
            description
          }
        }
      }
    `,
    data: {
      uuid: {
        __typename: 'User',
        ...user,
      },
    },
  })
})
