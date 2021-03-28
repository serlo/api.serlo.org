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

import { Scope, Thread } from '~/authorization'
import {
  resolveRolesPayload,
  Role,
  RolesPayload,
} from '~/schema/authorization/roles'

describe('resolveRolesPayload', () => {
  test('No roles', () => {
    const rolesPayload: RolesPayload = {}
    expect(resolveRolesPayload(rolesPayload)).toEqual({})
  })

  test('Scoped roles grant permissions only in those scopes', () => {
    const payload = resolveRolesPayload({
      [Scope.Serlo_De]: [Role.Moderator],
    })
    expect(
      Thread.setThreadArchived({ payload, scope: Scope.Serlo_De })
    ).toBeTruthy()
    expect(
      Thread.setThreadArchived({ payload, scope: Scope.Serlo_En })
    ).toBeFalsy()
    expect(
      Thread.setThreadArchived({ payload, scope: Scope.Serlo })
    ).toBeFalsy()
  })

  test('Global roles grant permissions in all scopes', () => {
    const payload = resolveRolesPayload({
      [Scope.Serlo]: [Role.Moderator],
    })
    expect(
      Thread.setThreadArchived({ payload, scope: Scope.Serlo })
    ).toBeTruthy()
    expect(
      Thread.setThreadArchived({ payload, scope: Scope.Serlo_De })
    ).toBeTruthy()
    expect(
      Thread.setThreadArchived({ payload, scope: Scope.Serlo_En })
    ).toBeTruthy()
  })

  test('Roles also grant permissions of inherited roles', () => {
    const payload = resolveRolesPayload({
      [Scope.Serlo]: [Role.Sysadmin],
    })
    expect(Thread.setCommentState({ payload, scope: Scope.Serlo })).toBeTruthy()
  })
})
