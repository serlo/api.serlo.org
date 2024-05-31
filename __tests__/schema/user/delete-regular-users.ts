import gql from 'graphql-tag'

import { article, user as baseUser } from '../../../__fixtures__'
import { Client, given, userQuery } from '../../__utils__'

const input = { username: '1274f605', id: 35412 }
const mutation = new Client({ userId: 1 }).prepareQuery({
  query: gql`
    mutation ($input: UserDeleteRegularUsersInput!) {
      user {
        deleteRegularUser(input: $input) {
          success
        }
      }
    }
  `,
  variables: { input },
})

beforeEach(() => {
  given('UuidQuery').for({ ...baseUser, id: input.id })
})

test('runs successfully if mutation could be successfully executed', async () => {
  expect(global.kratos.identities).toHaveLength(1)
  await userQuery
    .withVariables({ id: input.id })
    .shouldReturnData({ uuid: { id: input.id } })

  await mutation.shouldReturnData({
    user: { deleteRegularUser: { success: true } },
  })

  // TODO: uncomment once UUID query does not call the database-layer any more if the UUID SQL query here is null
  // await userQuery.withVariables({ id: 35412 }).shouldReturnData({ uuid: null })
  expect(global.kratos.identities).toHaveLength(0)
})

test('fails if username does not match user', async () => {
  await mutation
    .changeInput({ username: 'something' })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails if one of the given bot ids is not a user', async () => {
  await mutation
    .changeInput({ id: article.id })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails if you try to delete user Deleted', async () => {
  await mutation.changeInput({ id: 4 }).shouldFailWithError('BAD_USER_INPUT')
})

test('fails if user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails if user does not have role "sysadmin"', async () => {
  const newMutation = await mutation.forUser('de_admin')
  await newMutation.shouldFailWithError('FORBIDDEN')
})

test('fails if kratos has an error', async () => {
  global.kratos.admin.deleteIdentity = () => {
    throw new Error('Error in kratos')
  }

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
