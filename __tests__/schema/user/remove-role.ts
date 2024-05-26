import { Scope } from '@serlo/authorization'
import gql from 'graphql-tag'

import { user as admin } from '../../../__fixtures__'
import { Client, userQuery } from '../../__utils__'
import { Instance, Role } from '~/types'

const globalRole = Role.Sysadmin
const scopedRole = Role.Reviewer
const instance = Instance.De
const input = {
  username: admin.username,
  role: globalRole,
}
const mutation = new Client({ userId: admin.id })
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
  .withInput(input)

describe('remove global role', () => {
  test('removes a role successfully', async () => {
    await userQuery.withVariables({ id: admin.id }).shouldReturnData({
      uuid: {
        roles: {
          nodes: [
            { role: Role.Login, scope: Scope.Serlo },
            { role: globalRole, scope: Scope.Serlo },
          ],
        },
      },
    })

    await mutation.shouldReturnData({ user: { removeRole: { success: true } } })

    await userQuery.withVariables({ id: admin.id }).shouldReturnData({
      uuid: { roles: { nodes: [{ role: Role.Login, scope: Scope.Serlo }] } },
    })
  })

  test('ignores instance if given', async () => {
    await mutation
      .withInput({ username: admin.username, role: globalRole, instance })
      .shouldReturnData({ user: { removeRole: { success: true } } })
  })

  test('fails if only scoped admin', async () => {
    const newMutation = await mutation.forUser('en_admin')
    await newMutation.shouldFailWithError('FORBIDDEN')
  })
})

describe('remove scoped role', () => {
  test('removes a role successfully', async () => {
    await mutation
      .withInput({ username: admin.username, role: scopedRole, instance })
      .shouldReturnData({ user: { removeRole: { success: true } } })
  })

  test('removes a role successfully if scoped admin', async () => {
    const newMutation = await mutation.forUser('de_admin')

    await newMutation
      .withInput({ username: admin.username, role: scopedRole, instance })
      .shouldReturnData({ user: { removeRole: { success: true } } })
  })

  test('fails if admin in wrong scope', async () => {
    const newMutation = await mutation
      .withInput({ username: admin.username, role: scopedRole, instance })
      .forUser('en_admin')
    await newMutation.shouldFailWithError('FORBIDDEN')
  })

  test('fails if not given an instance', async () => {
    await mutation
      .withInput({ username: admin.username, role: scopedRole })
      .shouldFailWithError('BAD_USER_INPUT')
  })
})

test('fails if user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails if user does not have role "admin"', async () => {
  const newMutation = await mutation.forUser('de_reviewer')
  await newMutation.shouldFailWithError('FORBIDDEN')
})
