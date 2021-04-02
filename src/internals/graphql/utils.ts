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
import { AuthenticationError, ForbiddenError } from 'apollo-server'

import { AuthorizationGuard, Scope } from '~/authorization'
import { Context } from '~/internals/graphql/context'
import { fetchAuthorizationPayload } from '~/schema/authorization/utils'

export function assertUserIsAuthenticated(
  userId: number | null
): asserts userId is number {
  if (userId === null) {
    throw new AuthenticationError('You are not logged in')
  }
}

export async function assertUserIsAuthorized({
  userId,
  guard,
  scope,
  message,
  dataSources,
}: {
  userId: number | null
  scope: Scope
  guard: AuthorizationGuard
  message: string
  dataSources: Context['dataSources']
}): Promise<void> {
  const authorizationPayload = await fetchAuthorizationPayload({
    userId,
    dataSources,
  })
  if (!guard({ authorizationPayload, scope })) {
    throw new ForbiddenError(message)
  }
}

export function createMutationNamespace() {
  return () => {
    return {}
  }
}
