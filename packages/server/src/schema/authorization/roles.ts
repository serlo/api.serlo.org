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
import { AuthorizationPayload, Permission, Scope } from '@serlo/authorization'
import * as R from 'ramda'

import { Role } from '~/types'

interface RoleDefinition {
  extends?: Role[]
  permissions?: Permission[]
}

const roleDefinitions: Record<Role, RoleDefinition> = {
  [Role.Guest]: {},
  [Role.Login]: {
    permissions: [
      Permission.Subscription_Set,
      Permission.Thread_CreateThread,
      Permission.Thread_CreateComment,
    ],
  },
  [Role.Sysadmin]: {
    extends: [Role.Guest, Role.Login, Role.Moderator],
  },

  [Role.Moderator]: {
    permissions: [
      Permission.Thread_SetThreadArchived,
      Permission.Thread_SetThreadState,
      Permission.Thread_SetCommentState,
    ],
  },
  [Role.Reviewer]: {
    permissions: [Permission.Uuid_SetState_EntityRevision],
  },
  [Role.Architect]: {
    permissions: [
      Permission.Uuid_SetState_Entity,
      Permission.Uuid_SetState_TaxonomyTerm,
    ],
  },
  [Role.StaticPagesBuilder]: {
    permissions: [
      Permission.Uuid_SetState_Page,
      Permission.Uuid_SetState_PageRevision,
    ],
  },
  [Role.Admin]: {
    extends: [Role.Moderator, Role.Reviewer, Role.Architect],
  },
}

export type RolesPayload = { [scope in Scope]?: Role[] }

export function resolveRolesPayload(
  payload: RolesPayload
): AuthorizationPayload {
  const permissions: AuthorizationPayload = {}

  // Root level
  const globalRoles = getRolesWithInheritance(payload[Scope.Serlo])
  let globalPermissions: Permission[] = []

  for (const globalRole of globalRoles) {
    globalPermissions = R.union(
      globalPermissions,
      getPermissionsForRole(globalRole)
    )
  }
  permissions[Scope.Serlo] = globalPermissions

  // Instance level
  for (const scope of R.values(Scope)) {
    if (scope === Scope.Serlo) continue
    let instancedPermissions = [...globalPermissions]
    const roles = getRolesWithInheritance(payload[scope])
    for (const role of roles) {
      instancedPermissions = R.union(
        instancedPermissions,
        getPermissionsForRole(role)
      )
    }
    permissions[scope] = instancedPermissions
  }

  return R.pickBy(R.complement(R.isEmpty), permissions)

  function getPermissionsForRole(role: Role): Permission[] {
    return roleDefinitions[role].permissions ?? []
  }

  function getRolesWithInheritance(initialRoles: Role[] = []): Role[] {
    const allRoles: Role[] = []
    const queue = [...initialRoles]

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const role = queue.pop()
      if (!role) return allRoles
      if (allRoles.includes(role)) continue
      allRoles.push(role)
      const inheritedRoles = roleDefinitions[role].extends ?? []
      queue.push(...inheritedRoles)
    }
  }
}
