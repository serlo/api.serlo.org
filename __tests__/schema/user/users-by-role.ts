import gql from 'graphql-tag'

import { user as sysadmin, user2 as reviewer } from '../../../__fixtures__'
import { Client, given, Query } from '../../__utils__'
import { Instance, Role } from '~/types'

let client: Client
let query: Query

const globalRole = Role.Sysadmin
const localRole = Role.Reviewer
const instance = Instance.De

describe('get users by role tests', () => {
  beforeEach(() => {
    client = new Client({ userId: sysadmin.id })
    query = client
      .prepareQuery({
        query: gql`
          query (
            $role: Role!
            $instance: Instance
            $first: Int
            $after: String
          ) {
            user {
              usersByRole(
                after: $after
                role: $role
                instance: $instance
                first: $first
              ) {
                nodes {
                  id
                }
              }
            }
          }
        `,
      })
      .withVariables({
        role: globalRole,
        first: 3,
        after: 'MQ==',
      })

    const sysadmin2 = { ...sysadmin, id: 2 }
    const sysadmin3 = { ...sysadmin, id: 6 }
    const sysadmin4 = { ...sysadmin, id: 10 }
    const sysadmin5 = { ...sysadmin, id: 396 }
  })

  describe('get users by globalRole', () => {
    test('get sysadmins', async () => {
      await query.shouldReturnData({
        user: { usersByRole: { nodes: [{ id: 2 }, { id: 6 }, { id: 10 }] } },
      })
    })

    test('ignores instance when given one', async () => {
      await query
        .withVariables({
          role: globalRole,
          instance,
          first: 3,
          after: 'MQ==',
        })
        .shouldReturnData({
          user: { usersByRole: { nodes: [{ id: 2 }, { id: 6 }, { id: 10 }] } },
        })
    })

    test('fails when only scoped admin', async () => {
      const newMutation = await query.forUser('en_admin')
      await newMutation.shouldFailWithError('FORBIDDEN')
    })
  })

  describe('get users by localRole', () => {
    test('get german reviewers', async () => {
      await query
        .withVariables({
          role: localRole,
          instance,
          first: 2,
        })
        .shouldReturnData({
          user: { usersByRole: { nodes: [{ id: 11 }, { id: 23 }] } },
        })
    })

    test.skip('get users when scoped admin', async () => {
      const newQuery = await query.forUser('de_admin')
      await newQuery
        .withVariables({ role: localRole, instance, first: 2 })
        .shouldReturnData({
          user: { usersByRole: { nodes: [{ id: 11 }, { id: 23 }] } },
        })
    })

    test('fails when admin in wrong scope', async () => {
      const newQuery = await query
        .withVariables({
          role: localRole,
          instance,
          first: 2,
        })
        .forUser('en_admin')
      await newQuery.shouldFailWithError('FORBIDDEN')
    })

    test('fails when given global scope', async () => {
      await query
        .withVariables({
          role: localRole,
          first: 2,
        })
        .shouldFailWithError('BAD_USER_INPUT')
    })
  })

  test('fails when user is not authenticated', async () => {
    await query.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
  })

  test('fails when user does not have role "admin"', async () => {
    const newQuery = await query.forUser('de_reviewer')
    await newQuery.shouldFailWithError('FORBIDDEN')
  })

  test('fails when database layer has an internal error', async () => {
    await query.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})
