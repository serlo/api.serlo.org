import {
  AuthorizationPayload,
  instanceToScope,
  Scope,
} from '@serlo/authorization'
import * as t from 'io-ts'

import { UuidResolver } from '../uuid/abstract-uuid/resolvers'
import { Context } from '~/context'
import { UserInputError } from '~/errors'
import { Model } from '~/internals/graphql'
import {
  DiscriminatorType,
  EntityRevisionDecoder,
  PageRevisionDecoder,
  UserDecoder,
  UuidDecoder,
} from '~/model/decoder'
import { resolveRolesPayload, RolesPayload } from '~/schema/authorization/roles'
import { isInstance, isInstanceAware } from '~/schema/instance/utils'
import { Role } from '~/types'
import { isDefined } from '~/utils'

export async function fetchAuthorizationPayload(
  context: Context,
): Promise<AuthorizationPayload> {
  async function fetchRolesPayload(): Promise<RolesPayload> {
    if (context.userId === null) {
      return {
        [Scope.Serlo]: [Role.Guest],
      }
    }

    const user = await UuidResolver.resolveWithDecoder(
      UserDecoder,
      { id: context.userId },
      context,
    )

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

export async function fetchScopeOfUuid(
  {
    id,
  }: {
    id: number
  },
  context: Context,
): Promise<Scope> {
  const object = await UuidResolver.resolve({ id }, context)

  if (object === null) throw new UserInputError('UUID does not exist.')

  const instance = await fetchInstance(object, context)

  return instance != null ? instanceToScope(instance) : Scope.Serlo
}

export async function fetchScopeOfNotificationEvent(
  {
    id,
  }: {
    id: number
  },
  context: Context,
): Promise<Scope> {
  const event = await context.dataSources.model.serlo.getNotificationEvent({
    id,
  })
  if (event === null)
    throw new UserInputError('Notification event does not exist.')

  return await fetchScopeOfUuid({ id: event.objectId }, context)
}

export function resolveScopedRoles(user: Model<'User'>): Model<'ScopedRole'>[] {
  return user.roles.map(legacyRoleToRole).filter(isDefined)
}

export async function fetchInstance(
  object: t.TypeOf<typeof UuidDecoder> | null,
  context: Context,
) {
  if (object == null) return null

  // If the object has an instance, return the corresponding scope
  if (isInstanceAware(object)) {
    return object.instance
  }

  // Comments and Threads don't have an instance itself, but their object descendant has
  if (object.__typename === DiscriminatorType.Comment) {
    const parent = await UuidResolver.resolve({ id: object.parentId }, context)
    return await fetchInstance(parent, context)
  }

  if (EntityRevisionDecoder.is(object) || PageRevisionDecoder.is(object)) {
    const repository = await UuidResolver.resolve(
      { id: object.repositoryId },
      context,
    )
    return await fetchInstance(repository, context)
  }

  return null
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
