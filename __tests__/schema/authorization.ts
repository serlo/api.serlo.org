import { Scope, Thread } from '@serlo/authorization'
import gql from 'graphql-tag'

import { Client } from '../__utils__'
import { resolveRolesPayload, RolesPayload } from '~/schema/authorization/roles'
import { Role } from '~/types'

describe('authorization', () => {
  test('Guests', async () => {
    await new Client()
      .prepareQuery({
        query: gql`
          {
            authorization
          }
        `,
      })
      .shouldReturnData({
        authorization: resolveRolesPayload({ [Scope.Serlo]: [Role.Guest] }),
      })
  })

  test('Authenticated Users (no special roles)', async () => {
    await new Client({ userId: 20 })
      .prepareQuery({
        query: gql`
          {
            authorization
          }
        `,
      })
      .shouldReturnData({
        authorization: resolveRolesPayload({ [Scope.Serlo]: [Role.Login] }),
      })
  })

  test('Authenticated Users (filter old legacy roles)', async () => {
    await new Client({ userId: 33931 })
      .prepareQuery({
        query: gql`
          {
            authorization
          }
        `,
      })
      .shouldReturnData({
        authorization: resolveRolesPayload({ [Scope.Serlo]: [Role.Login] }),
      })
  })

  test('Authenticated Users (map new legacy roles)', async () => {
    const { insertId } = await databaseForTests.mutate(
      "insert into role (name) values ('de_moderator')",
    )
    await databaseForTests.mutate(
      `insert into role_user (user_id, role_id) values (33931, ?)`,
      [insertId],
    )

    await new Client({ userId: 33931 })
      .prepareQuery({
        query: gql`
          {
            authorization
          }
        `,
      })
      .shouldReturnData({
        authorization: resolveRolesPayload({
          [Scope.Serlo]: [Role.Login],
          [Scope.Serlo_De]: [Role.Moderator],
        }),
      })
  })
})

describe('resolveRolesPayload', () => {
  test('No roles', () => {
    const rolesPayload: RolesPayload = {}
    expect(resolveRolesPayload(rolesPayload)).toEqual({})
  })

  test('Scoped roles grant permissions only in those scopes', () => {
    const authorizationPayload = resolveRolesPayload({
      [Scope.Serlo_De]: [Role.Moderator],
    })
    expect(
      Thread.setThreadArchived(Scope.Serlo_De)(authorizationPayload),
    ).toBeTruthy()
    expect(
      Thread.setThreadArchived(Scope.Serlo_En)(authorizationPayload),
    ).toBeFalsy()
    expect(
      Thread.setThreadArchived(Scope.Serlo)(authorizationPayload),
    ).toBeFalsy()
  })

  test('Global roles grant permissions in all scopes', () => {
    const authorizationPayload = resolveRolesPayload({
      [Scope.Serlo]: [Role.Moderator],
    })
    expect(
      Thread.setThreadArchived(Scope.Serlo)(authorizationPayload),
    ).toBeTruthy()
    expect(
      Thread.setThreadArchived(Scope.Serlo_De)(authorizationPayload),
    ).toBeTruthy()
    expect(
      Thread.setThreadArchived(Scope.Serlo_En)(authorizationPayload),
    ).toBeTruthy()
  })

  test('Roles also grant permissions of inherited roles', () => {
    const authorizationPayload = resolveRolesPayload({
      [Scope.Serlo]: [Role.Sysadmin],
    })
    expect(
      Thread.setCommentState(Scope.Serlo)(authorizationPayload),
    ).toBeTruthy()
  })
})
