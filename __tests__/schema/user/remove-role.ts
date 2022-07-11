/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Scope } from '@serlo/authorization'
import { gql } from 'apollo-server'

import { user } from '../../../__fixtures__'
import {
  Client,
  Database,
  given,
  Query,
  returnsUuidsFromDatabase,
} from '../../__utils__'
import { Instance, Role } from '~/types'

let database: Database

let client: Client
let mutation: Query
let uuidQuery: Query

const globalRole = Role.Sysadmin
const localRole = Role.Reviewer
const globalScope = 'Serlo'
const localScope = 'Serlo_De'

beforeEach(() => {
  client = new Client({ userId: user.id })
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
      username: user.username,
      role: globalRole,
      scope: globalScope,
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
    .withVariables({ id: user.id })

  database = new Database()
  database.hasUuids([user])

  given('UuidQuery').isDefinedBy(returnsUuidsFromDatabase(database))
  given('UserRemoveRoleMutation').returns({ success: true })
  given('AliasQuery')
    .withPayload({
      instance: Instance.De,
      path: `user/profile/${user.username}`,
    })
    .returns({
      id: user.id,
      instance: Instance.De,
      path: `/user/${user.id}/${user.username}`,
    })
})

describe('remove global role', () => {
  test('removes a role successfully', async () => {
    await mutation.shouldReturnData({ user: { removeRole: { success: true } } })
  })

  test('fails when given invalid scope', async () => {
    await mutation
      .withVariables({
        input: { username: user.username, role: globalRole, scope: localScope },
      })
      .shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when only scoped admin', async () => {
    await mutation.forLoginUser('en_admin').shouldFailWithError('FORBIDDEN')
  })
})

describe('remove scoped role', () => {
  test('removes a role successfully', async () => {
    await mutation
      .withVariables({
        input: { username: user.username, role: localRole, scope: localScope },
      })
      .shouldReturnData({ user: { removeRole: { success: true } } })
  })

  test('removes a role successfully when scoped admin', async () => {
    await mutation
      .forLoginUser('de_admin')
      .withVariables({
        input: { username: user.username, role: localRole, scope: localScope },
      })
      .shouldReturnData({ user: { removeRole: { success: true } } })
  })

  test('fails when admin in wrong scope', async () => {
    await mutation
      .withVariables({
        input: { username: user.username, role: localRole, scope: localScope },
      })
      .forLoginUser('en_admin')
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when given global scope', async () => {
    await mutation
      .withVariables({
        input: { username: user.username, role: localRole, scope: globalScope },
      })
      .shouldFailWithError('BAD_USER_INPUT')
  })
})

test('updates the cache', async () => {
  await uuidQuery.shouldReturnData({
    uuid: {
      roles: {
        nodes: [
          {
            role: Role.Login,
            scope: Scope.Serlo,
          },
          {
            role: globalRole,
            scope: Scope.Serlo,
          },
        ],
      },
    },
  })
  await mutation.execute()
  await uuidQuery.shouldReturnData({
    uuid: { roles: { nodes: [{ role: Role.Login, scope: Scope.Serlo }] } },
  })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "admin"', async () => {
  await mutation.forLoginUser('en_reviewer').shouldFailWithError('FORBIDDEN')
})

test('fails when database layer has an internal error', async () => {
  given('UserRemoveRoleMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
