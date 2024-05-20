import gql from 'graphql-tag'

import { user } from '../../../__fixtures__'
import { Client } from '../../__utils__'

const input = { userId: user.id, email: 'user@example.org' }
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
  .withInput(input)

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  await query.shouldReturnData({ user: { setEmail: { success: true } } })

  const { email } = await databaseForTests.fetchOne<{ email: string }>(
    'select email from user where id = ?',
    [input.userId],
  )

  expect(email).toBe(input.email)
})

test('fails when user is not authenticated', async () => {
  await query.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "sysadmin"', async () => {
  await query.forLoginUser('de_admin').shouldFailWithError('FORBIDDEN')
})
