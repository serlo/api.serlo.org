import { Scope } from '@serlo/authorization'
import gql from 'graphql-tag'

import { user as admin, user2 as regularUser } from '../../../__fixtures__'
import { Client, given, Query } from '../../__utils__'
import { Instance, Role } from '~/types'

let client: Client
let mutation: Query
let uuidQuery: Query

const globalRole = Role.Sysadmin
const scopedRole = Role.Reviewer
const instance = Instance.De

beforeEach(() => {
  client = new Client({ userId: admin.id })
  mutation = client
    .prepareQuery({
      query: gql`
        mutation ($input: UserRoleInput!) {
          user {
            addRole(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withInput({
      username: regularUser.username,
      role: globalRole,
    })

  uuidQuery = client
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on User {
              roles {
                nodes {
                  role
                  scope
                }
              }
            }
          }
        }
      `,
    })
    .withVariables({ id: regularUser.id })

  given('AliasQuery')
    .withPayload({
      instance: Instance.De,
      path: `user/profile/${regularUser.username}`,
    })
    .returns({
      id: regularUser.id,
      instance: Instance.De,
      path: `/user/${regularUser.id}/${regularUser.username}`,
    })
})

describe('add global role', () => {
  test('adds a role successfully', async () => {
    await mutation.shouldReturnData({ user: { addRole: { success: true } } })
  })

  test('ignores instance when given one', async () => {
    await mutation
      .withInput({
        username: regularUser.username,
        role: globalRole,
        instance,
      })
      .shouldReturnData({ user: { addRole: { success: true } } })
  })

  test('fails when only scoped admin', async () => {
    await mutation.forLoginUser('en_admin').shouldFailWithError('FORBIDDEN')
  })
})

describe('add scoped role', () => {
  test('adds a role successfully', async () => {
    await mutation
      .withInput({
        username: regularUser.username,
        role: scopedRole,
        instance,
      })
      .shouldReturnData({ user: { addRole: { success: true } } })
  })

  test('adds a role successfully when scoped admin', async () => {
    await mutation
      .forLoginUser('de_admin')
      .withInput({
        username: regularUser.username,
        role: scopedRole,
        instance,
      })
      .shouldReturnData({ user: { addRole: { success: true } } })
  })

  test('fails when admin in wrong scope', async () => {
    await mutation
      .withInput({
        username: regularUser.username,
        role: scopedRole,
        instance,
      })
      .forLoginUser('en_admin')
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when not given an instance', async () => {
    await mutation
      .withInput({
        username: regularUser.username,
        role: scopedRole,
      })
      .shouldFailWithError('BAD_USER_INPUT')
  })
})

test('updates the cache', async () => {
  await uuidQuery.shouldReturnData({
    uuid: {
      roles: {
        nodes: [{ role: Role.Login, scope: Scope.Serlo }],
      },
    },
  })
  await mutation.execute()
  await uuidQuery.shouldReturnData({
    uuid: {
      roles: {
        nodes: [
          { role: Role.Login, scope: Scope.Serlo },
          { role: globalRole, scope: Scope.Serlo },
        ],
      },
    },
  })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "admin"', async () => {
  await mutation.forLoginUser('en_reviewer').shouldFailWithError('FORBIDDEN')
})
