import { UserInputError } from 'apollo-server'

import { AuthorizationPayload, instanceToScope, Scope } from '~/authorization'
import { Context } from '~/internals/graphql'
import { DiscriminatorType, UserDecoder } from '~/model/decoder'
import {
  resolveRolesPayload,
  Role,
  RolesPayload,
} from '~/schema/authorization/roles'
import { isInstance, isInstanceAware } from '~/schema/instance/utils'

export async function fetchAuthorizationPayload({
  userId,
  dataSources,
}: {
  userId: number | null
  dataSources: Context['dataSources']
}): Promise<AuthorizationPayload> {
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
}

export async function fetchScopeOfUuid({
  id,
  dataSources,
}: {
  id: number
  dataSources: Context['dataSources']
}): Promise<Scope> {
  const object = await dataSources.model.serlo.getUuid({ id })
  if (object === null) throw new UserInputError('UUID does not exist.')

  // If the object has an instance, return the corresponding scope
  if (isInstanceAware(object)) {
    return instanceToScope(object.instance)
  }

  // Comments and Threads don't have an instance itself, but their object descendant has
  if (object.__typename === DiscriminatorType.Comment) {
    return await fetchScopeOfUuid({ id: object.parentId, dataSources })
  }

  return Scope.Serlo
}
