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

/**
 * Users are granted permissions in a specific scope. Scopes may inherit other scopes. Therefore, scopes are lay out
 * in a tree-like structure (or to be more precise, a forest-like structure). For now, we have a scope for each
 * instance (e.g. de.serlo.org) and one global scope (e.g. serlo.org). In the future we might add more granular scopes
 * (e.g. subject "Mathematik" in de.serlo.org) or other global scopes (e.g. some-fancy-new-product.serlo.org).
 *
 * The scope name represents its inheritance path, split by a colon (e.g. "serlo.org:de:math:foobar"). This allows us
 * to optimize fetching the authorization payload later (e.g. frontend might only request the permissions for de.serlo.org).
 */
import { Instance } from '~/types'

export enum Scope {
  Serlo = 'serlo.org',
  Serlo_De = 'serlo.org:de',
  Serlo_En = 'serlo.org:en',
  Serlo_Es = 'serlo.org:es',
  Serlo_Fr = 'serlo.org:fr',
  Serlo_Hi = 'serlo.org:hi',
  Serlo_Ta = 'serlo.org:ta',
}

export function instanceToScope(instance: Instance | null): Scope {
  return instance === null ? Scope.Serlo : (`serlo.org:${instance}` as Scope)
}

/**
 * Permissions are unique strings that implicitly have a special semantic. While legacy system had a distinction between
 * "global" permissions and "instanced" permissions, our API implementation does not make that distinction. Any permission
 * may be granted in any scope.
 */
export enum Permission {
  Thread_CreateThread = 'thread:createThread',
  Thread_CreateComment = 'thread:createComment',
  Thread_SetThreadArchived = 'thread:setThreadArchived',
  Thread_SetThreadState = 'thread:setThreadState',
  Thread_SetCommentState = 'thread:setCommentState',
}

/**
 * The AuthorizationPayload is the opaque data structure that clients (e.g. frontend) use with our authorization API
 * (i.e. \@serlo/authorization package) to check if users is allowed to do something. For now, it is an object representing
 * the granted permissions in each scope (while also including the granted permissions of parent scopes). We can optimize
 * that payload later if needed.
 */
export type AuthorizationPayload = {
  [scope in Scope]?: Permission[]
}

/**
 * An `AuthorizationGuard` expects an `AuthorizationPayload` and the current `Scope`. It returns true if the user
 * may do the action associated with the guard. See `createPermissionGuard` for an example.
 */
export type AuthorizationGuard = (args: {
  authorizationPayload: AuthorizationPayload
  scope: Scope
}) => boolean

/**
 * Creates an authorization guard that checks whether the user has the given permission in the given scope.
 *
 * @param permission The permission to check
 * @returns An `AuthorizationGuard`
 */
function createPermissionGuard(permission: Permission): AuthorizationGuard {
  return ({ authorizationPayload, scope }) => {
    return authorizationPayload[scope]?.includes(permission) === true
  }
}

/**
 * This is the public API supposed to be used by clients. The structure follows our GraphQL mutations as close as possible.
 */
export const Thread = {
  createThread: createPermissionGuard(Permission.Thread_CreateThread),
  createComment: createPermissionGuard(Permission.Thread_CreateComment),
  setThreadArchived: createPermissionGuard(Permission.Thread_SetThreadArchived),
  setThreadState: createPermissionGuard(Permission.Thread_SetThreadState),
  setCommentState: createPermissionGuard(Permission.Thread_SetCommentState),
}
