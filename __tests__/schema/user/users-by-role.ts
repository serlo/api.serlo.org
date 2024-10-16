import gql from 'graphql-tag'

import { user as sysadmin } from '../../../__fixtures__'
import { Client, Query } from '../../__utils__'
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
    beforeEach(async () => {
      const { insertId: reviwerId } = await databaseForTests.mutate(
        "insert into role (name) values ('de_reviewer')",
      )
      await databaseForTests.mutate(
        'insert into role_user (user_id, role_id) values (35377, ?), (24139, ?)',
        [reviwerId, reviwerId],
      )
    })

    test('get german reviewers', async () => {
      await query
        .withVariables({ role: localRole, instance, first: 2 })
        .shouldReturnData({
          user: { usersByRole: { nodes: [{ id: 24139 }, { id: 35377 }] } },
        })
    })

    test('get users when scoped admin', async () => {
      const newQuery = await query.forUser('de_admin')
      await newQuery
        .withVariables({ role: localRole, instance, first: 2 })
        .shouldReturnData({
          user: { usersByRole: { nodes: [{ id: 24139 }, { id: 35377 }] } },
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
})
