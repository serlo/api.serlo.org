import { Scope } from '@serlo/authorization'
import gql from 'graphql-tag'

import { user as admin } from '../../../__fixtures__'
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
            removeRole(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withInput({
      username: admin.username,
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
    .withVariables({ id: admin.id })

  given('UuidQuery').for(admin)
})

describe('remove global role', () => {
  test('removes a role successfully', async () => {
    await mutation.shouldReturnData({ user: { removeRole: { success: true } } })
  })

  test('ignores instance if given', async () => {
    await mutation
      .withInput({ username: admin.username, role: globalRole, instance })
      .shouldReturnData({ user: { removeRole: { success: true } } })
  })

  test('fails if only scoped admin', async () => {
    await mutation.forLoginUser('en_admin').shouldFailWithError('FORBIDDEN')
  })
})

describe('remove scoped role', () => {
  test('removes a role successfully', async () => {
    await mutation
      .withInput({ username: admin.username, role: scopedRole, instance })
      .shouldReturnData({ user: { removeRole: { success: true } } })
  })

  test('removes a role successfully if scoped admin', async () => {
    await mutation
      .forLoginUser('de_admin')
      .withInput({ username: admin.username, role: scopedRole, instance })
      .shouldReturnData({ user: { removeRole: { success: true } } })
  })

  test('fails if admin in wrong scope', async () => {
    await mutation
      .withInput({ username: admin.username, role: scopedRole, instance })
      .forLoginUser('en_admin')
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails if not given an instance', async () => {
    await mutation
      .withInput({ username: admin.username, role: scopedRole })
      .shouldFailWithError('BAD_USER_INPUT')
  })
})

// TODO: Enable once the user was moved to Uuid Query
test.skip('updates the cache', async () => {
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
  await mutation.execute()
  await uuidQuery.shouldReturnData({
    uuid: { roles: { nodes: [{ role: Role.Login, scope: Scope.Serlo }] } },
  })
})

test('fails if user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails if user does not have role "admin"', async () => {
  await mutation.forLoginUser('de_reviewer').shouldFailWithError('FORBIDDEN')
})
