import gql from 'graphql-tag'

import { user as sysadmin, user2 as reviewer } from '../../../__fixtures__'
import { castToUuid, Client, given, Query } from '../../__utils__'
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

    const sysadmin2 = { ...sysadmin, id: castToUuid(2) }
    const sysadmin3 = { ...sysadmin, id: castToUuid(6) }
    const sysadmin4 = { ...sysadmin, id: castToUuid(10) }
    const sysadmin5 = { ...sysadmin, id: castToUuid(396) }

    given('UsersByRoleQuery')
      .withPayload({ roleName: globalRole, first: 4, after: 1 })
      .returns({ usersByRole: [2, 6, 10, 396] })

    given('UuidQuery').for(sysadmin, sysadmin2, sysadmin3, sysadmin4, sysadmin5)
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
      await query.forLoginUser('en_admin').shouldFailWithError('FORBIDDEN')
    })
  })

  describe('get users by localRole', () => {
    beforeEach(() => {
      const reviewer2 = { ...reviewer, id: castToUuid(11) }
      const reviewer3 = { ...reviewer, id: castToUuid(30) }
      given('UsersByRoleQuery')
        .withPayload({ roleName: 'de_reviewer', first: 3 })
        .returns({ usersByRole: [11, 23, 30] })
      given('UuidQuery').for(reviewer, reviewer2, reviewer3)
    })
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

    test('get users when scoped admin', async () => {
      await query
        .forLoginUser('de_admin')
        .withVariables({
          role: localRole,
          instance,
          first: 2,
        })
        .shouldReturnData({
          user: { usersByRole: { nodes: [{ id: 11 }, { id: 23 }] } },
        })
    })

    test('fails when admin in wrong scope', async () => {
      await query
        .withVariables({
          role: localRole,
          instance,
          first: 2,
        })
        .forLoginUser('en_admin')
        .shouldFailWithError('FORBIDDEN')
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
    await query.forLoginUser('en_reviewer').shouldFailWithError('FORBIDDEN')
  })

  test('fails when database layer has an internal error', async () => {
    given('UsersByRoleQuery').hasInternalServerError()

    await query.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

test('get permissions for admin', async () => {
  // const admin = {...sysadmin, roles: ["admin"]}
  query = client
    .prepareQuery({
      query: gql`
        query ($role: Role!, $instance: Instance) {
          user {
            usersByRole(role: $role, instance: $instance) {
              permissions
              inheritance
            }
          }
        }
      `,
    })
    .withVariables({
      role: 'admin',
      instance: Instance.De,
    })

  given('UsersByRoleQuery')
    .withPayload({ roleName: 'de_admin' })
    .returns({ usersByRole: [] })

  given('UuidQuery').for(sysadmin)

  await query.shouldReturnData({
    user: {
      usersByRole: {
        permissions: [
          'file:delete',
          'user:getUsersByRole',
          'thread:deleteThread',
          'thread:deleteComment',
          'user:addRole',
          'user:removeRole',
          'uuid:delete:entity',
          'uuid:create:entityRevision',
          'uuid:delete:page',
          'uuid:delete:pageRevision',
          'uuid:delete:taxonomyTerm',
        ],
        inheritance: [
          Role.Admin,
          Role.Architect,
          Role.Reviewer,
          Role.Moderator,
        ],
      },
    },
  })
})
