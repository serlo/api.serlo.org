/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { GraphQLResolveInfo } from 'graphql'

import { Context } from '../../types'
import { requestsOnlyFields } from '../../utils'
import { decodePath } from '../alias'
import { UserPayload } from '../user'
import {
  AbstractEntityPreResolver,
  AbstractEntityRevisionPreResolver,
  EntityRevisionType,
  EntityType,
} from './types'

export function createEntityResolvers<
  E extends AbstractEntityPreResolver,
  R extends AbstractEntityRevisionPreResolver
>({ entityRevisionType }: { entityRevisionType: EntityRevisionType }) {
  return {
    alias(entity: E) {
      return Promise.resolve(entity.alias ? decodePath(entity.alias) : null)
    },
    async currentRevision(
      entity: E,
      _args: never,
      { dataSources }: Context,
      info: GraphQLResolveInfo
    ) {
      if (!entity.currentRevisionId) return null
      const partialCurrentRevision = { id: entity.currentRevisionId }
      if (requestsOnlyFields(entityRevisionType, ['id'], info)) {
        return partialCurrentRevision
      }
      return dataSources.serlo.getUuid<R>(partialCurrentRevision)
    },
    async license(
      entity: E,
      _args: never,
      { dataSources }: Context,
      info: GraphQLResolveInfo
    ) {
      const partialLicense = { id: entity.licenseId }
      if (requestsOnlyFields('License', ['id'], info)) {
        return partialLicense
      }
      return dataSources.serlo.getLicense(partialLicense)
    },
  }
}

export function createEntityRevisionResolvers<
  E extends AbstractEntityPreResolver,
  R extends AbstractEntityRevisionPreResolver
>({ entityType, repository }: { entityType: EntityType; repository: string }) {
  return {
    async author(
      entityRevision: R,
      _args: never,
      { dataSources }: Context,
      info: GraphQLResolveInfo
    ) {
      const partialUser = { id: entityRevision.authorId }
      if (requestsOnlyFields('User', ['id'], info)) {
        return partialUser
      }
      return dataSources.serlo.getUuid<UserPayload>(partialUser)
    },
    [repository]: async (
      entityRevision: R,
      _args: never,
      { dataSources }: Context,
      info: GraphQLResolveInfo
    ) => {
      const partialEntity = { id: entityRevision.repositoryId }
      if (requestsOnlyFields(entityType, ['id'], info)) {
        return partialEntity as Partial<E>
      }
      return dataSources.serlo.getUuid<E>(partialEntity)
    },
  }
}
