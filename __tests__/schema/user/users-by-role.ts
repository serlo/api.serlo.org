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

import {castToUuid, Client, given, Query} from '../../__utils__'
import {Role, Scope} from "~/types"
import { gql } from 'apollo-server'
import {user as sysadmin, user2 as reviewer} from "../../../__fixtures__"

let client: Client
let query: Query

const globalRole = Role.Sysadmin
const globalScope = Scope.Serlo
const localRole = Role.Reviewer
const localScope = Scope.SerloDe

beforeEach(() => {
  client = new Client({userId: sysadmin.id})
  query = client
  .prepareQuery({
      query: gql`
          query ($role: Role!, $scope: Scope!, $first: Int, $after: String) {
              user {
                  usersByRole(after: $after, role: $role, scope: $scope, first: $first) {
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
    scope: globalScope,
    first: 3,
    after: 'MQ=='
  })

  const sysadmin2 = { ...sysadmin, id: castToUuid(2)}
  const sysadmin3 = { ...sysadmin, id: castToUuid(6)}
  const sysadmin4 = { ...sysadmin, id: castToUuid(10)}
  const sysadmin5 = { ...sysadmin, id: castToUuid(396)}


  given('UsersByRoleQuery').withPayload({roleName: globalRole,
    first: 4,
    after: 1})
    .returns({usersByRole: [2, 6, 10, 396]})

  given('UuidQuery').for(sysadmin, sysadmin2, sysadmin3, sysadmin4, sysadmin5)
})

describe('get users by globalRole', () => {
  test('get sysadmins', async () => {
    await query.shouldReturnData({ user: { usersByRole: { nodes: [{ id: 2}, {id: 6 }, {id: 10 }]}}})
  })

  test('fails when given invalid scope', async () => {
    await query
      .withVariables({
        role: globalRole,
        scope: localScope,
        first: 5
      })
      .shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when only scoped admin', async () => {
    await query.forLoginUser('en_admin').shouldFailWithError('FORBIDDEN')
  })
})

describe('get users by localRole', () => {
  beforeEach(() => {

    const reviewer2 = { ...reviewer, id: castToUuid(11)}
    const reviewer3 = { ...reviewer, id: castToUuid(30)}
    given('UsersByRoleQuery').withPayload({roleName: 'de_reviewer', first: 3})
      .returns({usersByRole: [11, 23, 30]})
    given('UuidQuery').for(reviewer, reviewer2, reviewer3)
  })
  test('get german reviewers', async () => {
    await query
      .withVariables({
        role: localRole,
        scope: localScope,
        first: 2
      })
      .shouldReturnData({ user: { usersByRole: { nodes: [{ id: 11}, {id: 23 }]}}})
  })

  test('get users when scoped admin', async () => {
    await query
      .forLoginUser('de_admin')
      .withVariables({
        role: localRole,
        scope: localScope,
        first: 2
      })
      .shouldReturnData({ user: { usersByRole: { nodes: [{ id: 11}, {id: 23 }]}} })
  })

  test('fails when admin in wrong scope', async () => {
    await query
      .withVariables({
        role: localRole,
        scope: localScope,
        first: 2
      })
      .forLoginUser('en_admin')
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when given global scope', async () => {
    await query
      .withVariables({
        role: localRole,
        scope: globalScope,
        first: 2
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
