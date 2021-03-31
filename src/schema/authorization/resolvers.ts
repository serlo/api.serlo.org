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
import { resolveRolesPayload, RolesPayload } from './roles'
import { getUserRoles } from './utils'
import { instanceToScope, Scope } from '~/authorization'
import { Model, Queries } from '~/internals/graphql'
import { UserDecoder } from '~/model/decoder'
import { Role } from '~/types'

export const resolvers: Queries<'authorization'> = {
  Query: {
    async authorization(_parent, _payload, { userId, dataSources }) {
      if (userId === null) {
        return resolveRolesPayload({
          [Scope.Serlo]: [Role.Guest],
        })
      }

      const user = await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: userId,
        decoder: UserDecoder,
      })

      if (user === null) {
        throw new Error(`id ${userId} need to be a user`)
      }

      return resolveRolesPayload(fetchRolesPayload(user))
    },
  },
}

function fetchRolesPayload(user: Model<'User'>): RolesPayload {
  const legacyRoles = getUserRoles(user)
  const rolesPayload: RolesPayload = {}

  for (const { role, scope: instance } of legacyRoles) {
    const scope = instanceToScope(instance ?? null)
    rolesPayload[scope] = rolesPayload[scope] ?? []
    rolesPayload[scope]?.push(role)
  }

  return rolesPayload
}
