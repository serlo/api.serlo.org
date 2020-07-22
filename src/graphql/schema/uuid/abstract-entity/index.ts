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
import { forEachObjIndexed } from 'ramda'

import { Instance } from '../../../../types'
import { Schema } from '../../utils'
import { encodePath } from '../alias'
import { resolvers } from './resolvers'
import {
  AbstractEntityPayload,
  AbstractEntityPreResolver,
  AbstractEntityRevisionPayload,
  AbstractEntityRevisionPreResolver,
  EntityRevisionType,
  EntityType,
} from './types'
import typeDefs from './types.graphql'
import { createEntityResolvers, createEntityRevisionResolvers } from './utils'

export * from './types'
export * from './utils'

export const abstractEntitySchema = new Schema(
  (resolvers as unknown) as Schema['resolvers'],
  [typeDefs]
)

/**
 * TODO: Shouldn't be needed anymore after refactoring is complete
 * @deprecated
 */
export abstract class Entity implements AbstractEntityPreResolver {
  public abstract __typename: EntityType
  public id: number
  public trashed: boolean
  public instance: Instance
  public alias: string | null
  public date: string
  public licenseId: number
  public currentRevisionId: number | null

  public constructor(payload: AbstractEntityPayload) {
    this.id = payload.id
    this.trashed = payload.trashed
    this.instance = payload.instance
    this.alias = payload.alias ? encodePath(payload.alias) : null
    this.date = payload.date
    this.licenseId = payload.licenseId
    this.currentRevisionId = payload.currentRevisionId
  }
}

/**
 * TODO: Shouldn't be needed anymore after refactoring is complete
 * @deprecated
 */
export abstract class EntityRevision
  implements AbstractEntityRevisionPreResolver {
  public abstract __typename: EntityRevisionType
  public id: number
  public trashed: boolean
  public date: string
  public authorId: number
  public repositoryId: number

  public constructor(payload: AbstractEntityRevisionPayload) {
    this.id = payload.id
    this.trashed = payload.trashed
    this.date = payload.date
    this.authorId = payload.authorId
    this.repositoryId = payload.repositoryId
  }
}

/**
 * TODO: Shouldn't be needed anymore after refactoring is complete
 * @deprecated
 */
export function addEntityResolvers<
  E extends AbstractEntityPreResolver,
  R extends AbstractEntityRevisionPreResolver
>({
  schema,
  entityType,
  entityRevisionType,
  repository,
}: EntityResolversPayload) {
  const entityResolvers = createEntityResolvers<E, R>({ entityRevisionType })
  const entityRevisionResolvers = createEntityRevisionResolvers<E, R>({
    entityType,
    repository,
  })
  forEachObjIndexed((value, key) => {
    schema.addResolver<E, never, unknown>(entityType, key, value)
  }, entityResolvers)
  forEachObjIndexed((value, key) => {
    schema.addResolver<R, never, unknown>(
      entityRevisionType,
      key as string,
      value
    )
  }, entityRevisionResolvers)
}

/**
 * TODO: Shouldn't be needed anymore after refactoring is complete
 * @deprecated
 */
export interface EntityResolversPayload {
  schema: Schema
  entityType: EntityType
  entityRevisionType: EntityRevisionType
  repository: string
}
