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
import { resolveRolesPayload, Role, RolesPayload } from './roles'
import { instanceToScope, Scope } from '~/authorization'
import { Queries } from '~/internals/graphql'
import { UserDecoder } from '~/model/decoder'
import { isInstance } from '~/schema/instance/utils'

export const resolvers: Queries<'authorization'> = {
  Query: {
    // @ts-expect-error TODO: no idea why this expects `never` as return type
    async authorization(_parent, _payload, { userId, dataSources }) {
      async function fetchRolesPayload(): Promise<RolesPayload> {
        if (userId === null) {
          return {
            [Scope.Serlo]: [Role.Guest],
          }
        }

        const user = await dataSources.model.serlo.getUuidWithCustomDecoder({
          id: userId,
          decoder: UserDecoder,
        })
        const legacyRoles = user?.roles ?? []
        const rolesPayload: RolesPayload = {}

        for (const role of legacyRoles) {
          const result = legacyRoleToRole(role)
          if (result === null) continue
          rolesPayload[result.scope] = rolesPayload[result.scope] ?? []
          rolesPayload[result.scope]?.push(result.role)
        }

        return rolesPayload

        function legacyRoleToRole(
          role: string
        ): { scope: Scope; role: Role } | null {
          const globalRole = legacyRoleToGlobalRole(role)
          if (globalRole) {
            return { scope: Scope.Serlo, role: globalRole }
          }

          const [instance, roleName] = role.split('_', 2)
          const instancedRole = legacyRoleToInstancedRole(roleName)
          if (isInstance(instance) && instancedRole) {
            return { scope: instanceToScope(instance), role: instancedRole }
          }

          return null
        }

        function legacyRoleToGlobalRole(role: string): Role | null {
          switch (role) {
            case 'guest':
              return Role.Guest
            case 'login':
              return Role.Login
            case 'sysadmin':
              return Role.Sysadmin
            default:
              return null
          }
        }

        function legacyRoleToInstancedRole(role: string): Role | null {
          switch (role) {
            case 'moderator':
              return Role.Moderator
            case 'reviewer':
              return Role.Reviewer
            case 'architect':
              return Role.Architect
            case 'static_pages_builder':
              return Role.StaticPagesBuilder
            case 'admin':
              return Role.Admin
            default:
              return null
          }
        }
      }

      const rolesPayload = await fetchRolesPayload()
      return resolveRolesPayload(rolesPayload)
    },
  },
}
