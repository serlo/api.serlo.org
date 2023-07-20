import {
  AuthorizationPayload,
  instanceToScope,
  Scope,
} from '@serlo/authorization'
import { GraphQLError } from 'graphql'

import { Context, Model } from '~/internals/graphql'
import {
  DiscriminatorType,
  EntityRevisionDecoder,
  PageRevisionDecoder,
  UserDecoder,
} from '~/model/decoder'
import { resolveRolesPayload, RolesPayload } from '~/schema/authorization/roles'
import { isInstance, isInstanceAware } from '~/schema/instance/utils'
import { Role } from '~/types'
import { isDefined } from '~/utils'

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

    const rolesPayload: RolesPayload = {}

    for (const result of resolveScopedRoles(user)) {
      rolesPayload[result.scope] ??= []
      rolesPayload[result.scope]?.push(result.role)
    }

    return rolesPayload
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
  if (object === null)
    throw new GraphQLError('UUID does not exist.', {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    })

  // If the object has an instance, return the corresponding scope
  if (isInstanceAware(object)) {
    return instanceToScope(object.instance)
  }

  // Comments and Threads don't have an instance itself, but their object descendant has
  if (object.__typename === DiscriminatorType.Comment) {
    return await fetchScopeOfUuid({ id: object.parentId, dataSources })
  }

  if (EntityRevisionDecoder.is(object) || PageRevisionDecoder.is(object)) {
    return await fetchScopeOfUuid({ id: object.repositoryId, dataSources })
  }

  return Scope.Serlo
}

export async function fetchScopeOfNotificationEvent({
  id,
  dataSources,
}: {
  id: number
  dataSources: Context['dataSources']
}): Promise<Scope> {
  const event = await dataSources.model.serlo.getNotificationEvent({ id })
  if (event === null)
    throw new GraphQLError('Notification event does not exist.', {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    })

  return await fetchScopeOfUuid({
    id: event.objectId,
    dataSources,
  })
}

export function resolveScopedRoles(user: Model<'User'>): Model<'ScopedRole'>[] {
  return user.roles.map(legacyRoleToRole).filter(isDefined)
}

function legacyRoleToRole(role: string): Model<'ScopedRole'> | null {
  const globalRole = legacyRoleToGlobalRole(role)
  if (globalRole) {
    return { scope: Scope.Serlo, role: globalRole }
  }

  const instance = role.substring(0, 2)
  const roleName = role.substring(3)
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
