import gql from 'graphql-tag'

import { user as baseUser } from '../../../__fixtures__'
import { Client, given } from '../../__utils__'

const user = { ...baseUser, roles: ['sysadmin'] }
const query = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation ($input: UserSetEmailInput!) {
        user {
          setEmail(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput({ userId: user.id, email: 'user@example.org' })

beforeEach(() => {
  given('UuidQuery').for(user)
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  given('UserSetEmailMutation')
    .withPayload({ userId: user.id, email: 'user@example.org' })
    .returns({ success: true, username: user.username })

  await query.shouldReturnData({ user: { setEmail: { success: true } } })
})

test('fails when user is not authenticated', async () => {
  await query.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "sysadmin"', async () => {
  await query.forLoginUser('de_admin').shouldFailWithError('FORBIDDEN')
})
