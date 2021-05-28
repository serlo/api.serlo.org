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
import {
  AuthorizationPayload,
  instanceToScope,
  Scope,
} from '@serlo/authorization'
import { UserInputError } from 'apollo-server'

import { Context, Model } from '~/internals/graphql'
import {
  DiscriminatorType,
  EntityRevisionDecoder,
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
  if (object === null) throw new UserInputError('UUID does not exist.')

  // If the object has an instance, return the corresponding scope
  if (isInstanceAware(object)) {
    return instanceToScope(object.instance)
  }

  // Comments and Threads don't have an instance itself, but their object descendant has
  if (object.__typename === DiscriminatorType.Comment) {
    return await fetchScopeOfUuid({ id: object.parentId, dataSources })
  }

  if (EntityRevisionDecoder.is(object)) {
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
    throw new UserInputError('Notification event does not exist.')

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
    case 'staticPagesBuilder':
      return Role.StaticPagesBuilder
    case 'admin':
      return Role.Admin
    default:
      return null
  }
}
