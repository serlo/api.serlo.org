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
            username
            email
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

  await query.shouldReturnData({
    user: {
      setEmail: {
        success: true,
        username: user.username,
        email: 'user@example.org',
      },
    },
  })
})

test('fails when user is not authenticated', async () => {
  await query.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "sysadmin"', async () => {
  await query.forLoginUser('de_admin').shouldFailWithError('FORBIDDEN')
})

test('fails when database layer returns a 400er response', async () => {
  given('UserSetEmailMutation').returnsBadRequest()

  await query.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('UserSetEmailMutation').hasInternalServerError()

  await query.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
