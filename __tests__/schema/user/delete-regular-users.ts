import gql from 'graphql-tag'
import * as R from 'ramda'

import { user as baseUser } from '../../../__fixtures__'
import { Client, given, nextUuid, Query } from '../../__utils__'

let client: Client
let mutation: Query

const user = { ...baseUser, roles: ['sysadmin'] }
const noUserId = nextUuid(nextUuid(user.id))

beforeEach(() => {
  client = new Client({ userId: user.id })

  mutation = client
    .prepareQuery({
      query: gql`
        mutation ($input: UserDeleteRegularUsersInput!) {
          user {
            deleteRegularUser(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withInput(R.pick(['id', 'username'], user))

  given('UuidQuery').for(user)
})

test('runs successfully if mutation could be successfully executed', async () => {
  expect(global.kratos.identities).toHaveLength(1)

  await mutation.shouldReturnData({
    user: { deleteRegularUser: { success: true } },
  })
  expect(global.kratos.identities).toHaveLength(0)
})

test('fails if username does not match user', async () => {
  await mutation
    .withInput({ users: [{ id: user.id, username: 'something' }] })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('updates the cache', async () => {
  const uuidQuery = client
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            id
          }
        }
      `,
    })
    .withVariables({ id: user.id })

  await uuidQuery.shouldReturnData({ uuid: { id: user.id } })

  await mutation.execute()

  await uuidQuery.shouldReturnData({ uuid: null })
})

test('fails if one of the given bot ids is not a user', async () => {
  await mutation
    .withInput({ userIds: [noUserId] })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails if you try to delete user Deleted', async () => {
  await mutation.withInput({ userIds: 4 }).shouldFailWithError('BAD_USER_INPUT')
})

test('fails if user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails if user does not have role "sysadmin"', async () => {
  await mutation.forLoginUser('de_admin').shouldFailWithError('FORBIDDEN')
})

test('fails if kratos has an error', async () => {
  global.kratos.admin.deleteIdentity = () => {
    throw new Error('Error in kratos')
  }

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
