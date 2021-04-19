/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Scope, Thread } from '@serlo/authorization'
import { gql } from 'apollo-server'

import { user } from '../../__fixtures__'
import {
  assertSuccessfulGraphQLQuery,
  createTestClient,
  createUuidHandler,
} from '../__utils__'
import { resolveRolesPayload, RolesPayload } from '~/schema/authorization/roles'
import { Role } from '~/types'

describe('authorization', () => {
  test('Guests', async () => {
    const client = createTestClient()
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          authorization
        }
      `,
      data: {
        authorization: resolveRolesPayload({
          [Scope.Serlo]: [Role.Guest],
        }),
      },
      client,
    })
  })

  test('Authenticated Users (no special roles)', async () => {
    global.server.use(createUuidHandler({ ...user, roles: ['login'] }))
    const client = createTestClient({ userId: user.id })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          authorization
        }
      `,
      data: {
        authorization: resolveRolesPayload({
          [Scope.Serlo]: [Role.Login],
        }),
      },
      client,
    })
  })

  test('Authenticated Users (filter old legacy roles)', async () => {
    global.server.use(
      createUuidHandler({ ...user, roles: ['login', 'german_moderator'] })
    )
    const client = createTestClient({ userId: user.id })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          authorization
        }
      `,
      data: {
        authorization: resolveRolesPayload({
          [Scope.Serlo]: [Role.Login],
        }),
      },
      client,
    })
  })

  test('Authenticated Users (map new legacy roles)', async () => {
    global.server.use(
      createUuidHandler({ ...user, roles: ['login', 'de_moderator'] })
    )
    const client = createTestClient({ userId: user.id })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          authorization
        }
      `,
      data: {
        authorization: resolveRolesPayload({
          [Scope.Serlo]: [Role.Login],
          [Scope.Serlo_De]: [Role.Moderator],
        }),
      },
      client,
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
      Thread.setThreadArchived(Scope.Serlo_De)(authorizationPayload)
    ).toBeTruthy()
    expect(
      Thread.setThreadArchived(Scope.Serlo_En)(authorizationPayload)
    ).toBeFalsy()
    expect(
      Thread.setThreadArchived(Scope.Serlo)(authorizationPayload)
    ).toBeFalsy()
  })

  test('Global roles grant permissions in all scopes', () => {
    const authorizationPayload = resolveRolesPayload({
      [Scope.Serlo]: [Role.Moderator],
    })
    expect(
      Thread.setThreadArchived(Scope.Serlo)(authorizationPayload)
    ).toBeTruthy()
    expect(
      Thread.setThreadArchived(Scope.Serlo_De)(authorizationPayload)
    ).toBeTruthy()
    expect(
      Thread.setThreadArchived(Scope.Serlo_En)(authorizationPayload)
    ).toBeTruthy()
  })

  test('Roles also grant permissions of inherited roles', () => {
    const authorizationPayload = resolveRolesPayload({
      [Scope.Serlo]: [Role.Sysadmin],
    })
    expect(
      Thread.setCommentState(Scope.Serlo)(authorizationPayload)
    ).toBeTruthy()
  })
})
