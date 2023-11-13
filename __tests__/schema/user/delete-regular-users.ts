import gql from 'graphql-tag'
import { HttpResponse } from 'msw'
import * as R from 'ramda'

import { user as baseUser } from '../../../__fixtures__'
import { Client, given, nextUuid, Query } from '../../__utils__'

let client: Client
let mutation: Query

const user = { ...baseUser, roles: ['sysadmin'] }
const users = [user, { ...user, username: 'foo', id: nextUuid(user.id) }]
const noUserId = nextUuid(nextUuid(user.id))

beforeEach(() => {
  client = new Client({ userId: user.id })

  mutation = client
    .prepareQuery({
      query: gql`
        mutation ($input: UserDeleteRegularUsersInput!) {
          user {
            deleteRegularUsers(input: $input) {
              success
              username
              reason
            }
          }
        }
      `,
    })
    .withInput({ users: users.map(R.pick(['id', 'username'])) })

  given('UserDeleteRegularUsersMutation').isDefinedBy(async ({ request }) => {
    const body = await request.json()
    const { userId } = body.payload

    given('UuidQuery').withPayload({ id: userId }).returnsNotFound()

    return HttpResponse.json({ success: true })
  })

  given('UuidQuery').for(users)
})

test('runs successfully when mutation could be successfully executed', async () => {
  expect(global.kratos.identities).toHaveLength(users.length)

  await mutation.shouldReturnData({
    user: {
      deleteRegularUsers: [
        { success: true, username: user.username, reason: null },
        { success: true, username: 'foo', reason: null },
      ],
    },
  })
  expect(global.kratos.identities).toHaveLength(users.length - 2)
})

test('runs partially when one of the mutations failed', async () => {
  given('UserDeleteRegularUsersMutation').isDefinedBy(async ({ request }) => {
    const body = await request.json()
    const { userId } = body.payload

    if (userId === user.id)
      return HttpResponse.json({ success: false, reason: 'failure!' })

    given('UuidQuery').withPayload({ id: userId }).returnsNotFound()

    return HttpResponse.json({ success: true })
  })

  expect(global.kratos.identities).toHaveLength(users.length)

  await mutation.shouldReturnData({
    user: {
      deleteRegularUsers: [
        { success: false, username: user.username, reason: 'failure!' },
        { success: true, username: 'foo', reason: null },
      ],
    },
  })
  expect(global.kratos.identities).toHaveLength(users.length - 1)
})

test('fails when username does not match user', async () => {
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

test('fails when one of the given bot ids is not a user', async () => {
  await mutation
    .withInput({ userIds: [noUserId] })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "sysadmin"', async () => {
  await mutation.forLoginUser('de_admin').shouldFailWithError('FORBIDDEN')
})

test('fails when database layer has an internal error', async () => {
  given('UserDeleteRegularUsersMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')

  expect(global.kratos.identities).toHaveLength(users.length)
})

test('fails when kratos has an error', async () => {
  global.kratos.admin.deleteIdentity = () => {
    throw new Error('Error in kratos')
  }

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
