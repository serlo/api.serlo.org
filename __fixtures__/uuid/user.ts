import { gql } from 'apollo-server'

import { DiscriminatorType, UserPayload } from '../../src/graphql/schema'

export const user: UserPayload = {
  __typename: DiscriminatorType.User,
  id: 1,
  trashed: false,
  username: 'username',
  date: '2014-03-01T20:36:21Z',
  lastLogin: '2020-03-24T09:40:55Z',
  description: null,
}

export const user2: UserPayload = {
  __typename: DiscriminatorType.User,
  id: 23,
  trashed: false,
  username: 'second user',
  date: '2015-02-01T20:35:21Z',
  lastLogin: '2019-03-23T09:20:55Z',
  description: null,
}

export function createUserActiveDonorQuery(variables: UserPayload) {
  return {
    query: gql`
      query taxonomyTerms($id: Int!) {
        uuid(id: $id) {
          ... on User {
            activeDonor
          }
        }
      }
    `,
    variables,
  }
}
