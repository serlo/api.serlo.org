import gql from 'graphql-tag'

import { user } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'

const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation ($input: UserSetDescriptionInput!) {
        user {
          setDescription(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput({ description: 'description' })

beforeEach(() => {
  given('UuidQuery').for(user)
})

test('returns "{ success: true }" if mutation could be successfully executed', async () => {
  await mutation.shouldReturnData({
    user: { setDescription: { success: true } },
  })
})

test('fails if user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails if description is not under 64 kB', async () => {
  await mutation
    .withInput({ description: 'x'.repeat(64 * 1024) })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('updates the cache', async () => {
  const query = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on User {
              description
            }
          }
        }
      `,
    })
    .withVariables({ id: user.id })

  await query.shouldReturnData({ uuid: { description: null } })

  await mutation.execute()

  // We need to simulate that the description in the DB was changed
  // TODO: Delete the following line when user is moved into UuidResolver
  given('UuidQuery').for({ ...user, description: 'description' })

  await query.shouldReturnData({ uuid: { description: 'description' } })
})
