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
import { Instance } from '@serlo/api'

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

export enum Permission {
  Notification_SetState = 'notification:setState',
  Subscription_Set = 'subscription:set',
  Thread_CreateThread = 'thread:createThread',
  Thread_CreateComment = 'thread:createComment',
  Thread_SetThreadArchived = 'thread:setThreadArchived',
  Thread_SetThreadState = 'thread:setThreadState',
  Thread_SetCommentState = 'thread:setCommentState',
  Uuid_Create_Entity = 'uuid:create:entity',
  Uuid_Create_EntityRevision = 'uuid:create:entityRevision',
  Uuid_Create_Page = 'uuid:create:page',
  Uuid_Create_PageRevision = 'uuid:create:pageRevision',
  Uuid_Create_TaxonomyTerm = 'uuid:create:taxonomyTerm',
  Uuid_SetState_Entity = 'uuid:setState:entity',
  Uuid_SetState_EntityRevision = 'uuid:setState:entityRevision',
  Uuid_SetState_Page = 'uuid:setState:page',
  Uuid_SetState_PageRevision = 'uuid:setState:pageRevision',
  Uuid_SetState_TaxonomyTerm = 'uuid:setState:taxonomyTerm',
}

export type AuthorizationPayload = {
  [scope in Scope]?: Permission[]
}

export type AuthorizationGuard = (
  authorizationPayload: AuthorizationPayload
) => boolean

export type GenericAuthorizationGuard = (scope: Scope) => AuthorizationGuard

function createPermissionGuard(
  permission: Permission
): GenericAuthorizationGuard {
  return (scope) => (authorizationPayload) => {
    return authorizationPayload[scope]?.includes(permission) === true
  }
}

export const Notification = {
  setState: createPermissionGuard(Permission.Notification_SetState),
}

export const Subscription = {
  set: createPermissionGuard(Permission.Subscription_Set),
}

export const Thread = {
  createThread: createPermissionGuard(Permission.Thread_CreateThread),
  createComment: createPermissionGuard(Permission.Thread_CreateComment),
  setThreadArchived: createPermissionGuard(Permission.Thread_SetThreadArchived),
  setThreadState: createPermissionGuard(Permission.Thread_SetThreadState),
  setCommentState: createPermissionGuard(Permission.Thread_SetCommentState),
}

export type UuidType =
  | 'Entity'
  | 'EntityRevision'
  | 'Page'
  | 'PageRevision'
  | 'TaxonomyTerm'
  | 'User'
  | string

export const Uuid = {
  create: (type: UuidType): GenericAuthorizationGuard => {
    return (scope) => (authorizationPayload) => {
      switch (type) {
        case 'Entity':
          return checkPermission(Permission.Uuid_Create_Entity)
        case 'EntityRevision':
          return checkPermission(Permission.Uuid_Create_EntityRevision)
        case 'Page':
          return checkPermission(Permission.Uuid_Create_Page)
        case 'PageRevision':
          return checkPermission(Permission.Uuid_Create_PageRevision)
        case 'TaxonomyTerm':
          return checkPermission(Permission.Uuid_Create_TaxonomyTerm)
        case 'User':
          return false
        default:
          return false
      }

      function checkPermission(permission: Permission) {
        return createPermissionGuard(permission)(scope)(authorizationPayload)
      }
    }
  },
  setState: (type: UuidType): GenericAuthorizationGuard => {
    return (scope) => (authorizationPayload) => {
      switch (type) {
        case 'Entity':
          return checkPermission(Permission.Uuid_SetState_Entity)
        case 'EntityRevision':
          return checkPermission(Permission.Uuid_SetState_EntityRevision)
        case 'Page':
          return checkPermission(Permission.Uuid_SetState_Page)
        case 'PageRevision':
          return checkPermission(Permission.Uuid_SetState_PageRevision)
        case 'TaxonomyTerm':
          return checkPermission(Permission.Uuid_SetState_TaxonomyTerm)
        case 'User':
          return false
        default:
          return false
      }

      function checkPermission(permission: Permission) {
        return createPermissionGuard(permission)(scope)(authorizationPayload)
      }
    }
  },
}
