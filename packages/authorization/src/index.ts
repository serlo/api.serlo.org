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
  Entity_CheckoutRevision = 'entity:checkoutRevision',
  Entity_RejectRevision = 'entity:rejectRevision',
  Entity_SetLicense = 'entity:setLicense',
  Entity_AddChild = 'entity:addChild',
  Entity_RemoveChild = 'entity:removeChild',
  Entity_OrderChildren = 'entity:orderChildren',
  File_Create = 'file:create',
  File_Delete = 'file:delete',
  License_Create = 'license:create',
  License_Delete = 'license:delete',
  License_Set = 'license:set',
  Notification_SetState = 'notification:setState',
  Page_CheckoutRevision = 'page:checkoutRevision',
  Page_RejectRevision = 'page:rejectRevision',
  Page_Set = 'page:set',
  Subscription_Set = 'subscription:set',
  TaxonomyTerm_AddChild = 'taxonomyTerm:addChild',
  TaxonomyTerm_RemoveChild = 'taxonomyTerm:removeChild',
  TaxonomyTerm_OrderChildren = 'taxonomyTerm:orderChildren',
  TaxonomyTerm_Set = 'taxonomyTerm:set',
  Thread_CreateThread = 'thread:createThread',
  Thread_CreateComment = 'thread:createComment',
  Thread_DeleteThread = 'thread:deleteThread',
  Thread_DeleteComment = 'thread:deleteComment',
  User_DeleteBot = 'user:deleteBot',
  User_DeleteRegularUser = 'user:deleteRegularUser',
  User_SetEmail = 'user:setEmail',
  Thread_SetThreadArchived = 'thread:setThreadArchived',
  Thread_SetThreadState = 'thread:setThreadState',
  Thread_SetCommentState = 'thread:setCommentState',
  Uuid_Create_Entity = 'uuid:create:entity',
  Uuid_Create_EntityRevision = 'uuid:create:entityRevision',
  Uuid_Create_Page = 'uuid:create:page',
  Uuid_Create_PageRevision = 'uuid:create:pageRevision',
  Uuid_Create_TaxonomyTerm = 'uuid:create:taxonomyTerm',
  Uuid_Delete_Entity = 'uuid:delete:entity',
  Uuid_Delete_EntityRevision = 'uuid:delete:entityRevision',
  Uuid_Delete_Page = 'uuid:delete:page',
  Uuid_Delete_PageRevision = 'uuid:delete:pageRevision',
  Uuid_Delete_TaxonomyTerm = 'uuid:delete:taxonomyTerm',
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

export const Entity = {
  checkoutRevision: createPermissionGuard(Permission.Entity_CheckoutRevision),
  rejectRevision: createPermissionGuard(Permission.Entity_RejectRevision),
  setLicense: createPermissionGuard(Permission.Entity_SetLicense),
  addChild: createPermissionGuard(Permission.Entity_AddChild),
  removeChild: createPermissionGuard(Permission.Entity_RemoveChild),
  orderChildren: createPermissionGuard(Permission.Entity_OrderChildren),
}

export const File = {
  create: createPermissionGuard(Permission.File_Create),
  delete: createPermissionGuard(Permission.File_Delete),
}

export const License = {
  create: createPermissionGuard(Permission.License_Create),
  delete: createPermissionGuard(Permission.License_Delete),
  set: createPermissionGuard(Permission.License_Set),
}

export const Notification = {
  setState: createPermissionGuard(Permission.Notification_SetState),
}

export const Page = {
  checkoutRevision: createPermissionGuard(Permission.Page_CheckoutRevision),
  rejectRevision: createPermissionGuard(Permission.Page_RejectRevision),
  set: createPermissionGuard(Permission.Page_Set),
}

export const Subscription = {
  set: createPermissionGuard(Permission.Subscription_Set),
}

export const TaxonomyTerm = {
  addChild: createPermissionGuard(Permission.TaxonomyTerm_AddChild),
  removeChild: createPermissionGuard(Permission.TaxonomyTerm_RemoveChild),
  orderChildren: createPermissionGuard(Permission.TaxonomyTerm_OrderChildren),
  set: createPermissionGuard(Permission.TaxonomyTerm_Set),
}

export const Thread = {
  createThread: createPermissionGuard(Permission.Thread_CreateThread),
  createComment: createPermissionGuard(Permission.Thread_CreateComment),
  deleteThread: createPermissionGuard(Permission.Thread_DeleteThread),
  deleteComment: createPermissionGuard(Permission.Thread_DeleteComment),
  setThreadArchived: createPermissionGuard(Permission.Thread_SetThreadArchived),
  setThreadState: createPermissionGuard(Permission.Thread_SetThreadState),
  setCommentState: createPermissionGuard(Permission.Thread_SetCommentState),
}

export const User = {
  deleteBot: createPermissionGuard(Permission.User_DeleteBot),
  deleteRegularUser: createPermissionGuard(Permission.User_DeleteRegularUser),
  setEmail: createPermissionGuard(Permission.User_SetEmail),
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
  delete: (type: UuidType): GenericAuthorizationGuard => {
    return (scope) => (authorizationPayload) => {
      switch (type) {
        case 'Entity':
          return checkPermission(Permission.Uuid_Delete_Entity)
        case 'EntityRevision':
          return checkPermission(Permission.Uuid_Delete_EntityRevision)
        case 'Page':
          return checkPermission(Permission.Uuid_Delete_Page)
        case 'PageRevision':
          return checkPermission(Permission.Uuid_Delete_PageRevision)
        case 'TaxonomyTerm':
          return checkPermission(Permission.Uuid_Delete_TaxonomyTerm)
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
