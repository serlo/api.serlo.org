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
import { AuthorizationGuard } from '@serlo/authorization'
import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from 'apollo-server'
import * as R from 'ramda'

import { Context } from '~/internals/graphql/context'
import { fetchAuthorizationPayload } from '~/schema/authorization/utils'
import { isInstance } from '~/schema/instance/utils'
import { Instance, Role } from '~/types'

export function assertUserIsAuthenticated(
  userId: number | null
): asserts userId is number {
  if (userId === null) {
    throw new AuthenticationError('You are not logged in')
  }
}

export async function assertUserIsAuthorized({
  userId,
  message,
  dataSources,
  ...guardRequest
}: {
  userId: number | null
  message: string
  dataSources: Context['dataSources']
} & GuardRequest): Promise<void> {
  const authorizationPayload = await fetchAuthorizationPayload({
    userId,
    dataSources,
  })
  const guards = fromGuardRequest(guardRequest)
  guards.forEach((guard) => {
    if (!guard(authorizationPayload)) {
      throw new ForbiddenError(message)
    }
  })
}

export type GuardRequest =
  | { guard: AuthorizationGuard }
  | { guards: AuthorizationGuard[] }

function fromGuardRequest(guardRequest: GuardRequest): AuthorizationGuard[] {
  return R.has('guards', guardRequest)
    ? guardRequest.guards
    : [guardRequest.guard]
}

export function createNamespace() {
  return () => {
    return {}
  }
}

export function encodeId({ prefix, id }: { prefix: string; id: number }) {
  return encodeToBase64(`${prefix}${id}`)
}

export function decodeId({
  prefix,
  textId,
}: {
  prefix: string
  textId: string
}) {
  const decodedId = decodeFromBase64(textId)
  const id = parseInt(decodedId.substring(prefix.length))

  if (!Number.isNaN(id) && decodedId.substring(0, prefix.length) === prefix) {
    return id
  } else {
    throw new UserInputError('id `${textId}` is invalid')
  }
}

export function encodeToBase64(text: string) {
  return Buffer.from(text).toString('base64')
}

export function decodeFromBase64(text: string) {
  return Buffer.from(text, 'base64').toString('utf8')
}

export function assertStringIsNotEmpty(args: { [key: string]: unknown }) {
  const emptyArgs: string[] = Object.entries(args)
    .filter(
      ([_, value]) => typeof value === 'string' && value.trim().length === 0
    )
    .map(([key]) => key)

  if (emptyArgs.length > 0) {
    throw new UserInputError(
      `Arguments ${emptyArgs.join(', ')} may not be empty`
    )
  }
}

export function checkRoleInstanceCompatibility(
  role: Role,
  instance: Instance | null
) {
  if ([Role.Guest, Role.Login, Role.Sysadmin].includes(role) && isInstance(instance)) {
    throw new UserInputError('This role cannot be scoped.')
  }
  if (![Role.Guest, Role.Login, Role.Sysadmin].includes(role)  && !isInstance(instance)) {
    throw new UserInputError("This role can't have a global scope.")
  }
}
