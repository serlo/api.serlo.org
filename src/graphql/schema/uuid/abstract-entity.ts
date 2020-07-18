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
import { ForbiddenError } from 'apollo-server'

import { Instance, License, Scalars } from '../../../types'
import { SerloDataSource } from '../../data-sources/serlo'
import { Service } from '../types'
import { requestsOnlyFields, Schema } from '../utils'
import typeDefs from './abstract-entity.graphql'
import { AbstractUuidPreResolver, AbstractUuidPayload } from './abstract-uuid'
import { encodePath } from './alias'
import { AppletPayload, AppletRevisionPayload } from './applet'
import { ArticlePayload, ArticleRevisionPayload } from './article'
import { CoursePayload, CourseRevisionPayload } from './course'
import { CoursePagePayload, CoursePageRevisionPayload } from './course-page'
import { EventPayload, EventRevisionPayload } from './event'
import { ExercisePayload, ExerciseRevisionPayload } from './exercise'
import {
  ExerciseGroupPayload,
  ExerciseGroupRevisionPayload,
} from './exercise-group'
import {
  GroupedExercisePayload,
  GroupedExerciseRevisionPayload,
} from './grouped-exercise'
import { SolutionPayload, SolutionRevisionPayload } from './solution'
import { resolveUser, UserPreResolver, UserPayload } from './user'
import { VideoPayload, VideoRevisionPayload } from './video'

export const abstractEntitySchema = new Schema({}, [typeDefs])

export enum EntityType {
  Applet = 'Applet',
  Article = 'Article',
  Course = 'Course',
  CoursePage = 'CoursePage',
  Event = 'Event',
  Exercise = 'Exercise',
  ExerciseGroup = 'ExerciseGroup',
  GroupedExercise = 'GroupedExercise',
  Solution = 'Solution',
  Video = 'Video',
}

export type EntityPreResolver =
  | AppletPayload
  | ArticlePayload
  | CoursePayload
  | CoursePagePayload
  | EventPayload
  | ExercisePayload
  | ExerciseGroupPayload
  | GroupedExercisePayload
  | SolutionPayload
  | VideoPayload

export enum EntityRevisionType {
  ArticleRevision = 'ArticleRevision',
  AppletRevision = 'AppletRevision',
  CourseRevision = 'CourseRevision',
  CoursePageRevision = 'CoursePageRevision',
  EventRevision = 'EventRevision',
  ExerciseRevision = 'ExerciseRevision',
  ExerciseGroupRevision = 'ExerciseGroupRevision',
  GroupedExerciseRevision = 'GroupedExerciseRevision',
  SolutionRevision = 'SolutionRevision',
  VideoRevision = 'VideoRevision',
}

export type EntityRevisionPreResolver =
  | AppletRevisionPayload
  | ArticleRevisionPayload
  | CourseRevisionPayload
  | CoursePageRevisionPayload
  | EventRevisionPayload
  | ExerciseRevisionPayload
  | ExerciseGroupRevisionPayload
  | GroupedExerciseRevisionPayload
  | SolutionRevisionPayload
  | VideoRevisionPayload

export abstract class Entity implements AbstractUuidPreResolver {
  public abstract __typename: EntityType
  public id: number
  public trashed: boolean
  public instance: Instance
  public alias: string | null
  public date: string
  public licenseId: number
  public currentRevisionId: number | null

  public constructor(payload: EntityPayload) {
    this.id = payload.id
    this.trashed = payload.trashed
    this.instance = payload.instance
    this.alias = payload.alias ? encodePath(payload.alias) : null
    this.date = payload.date
    this.licenseId = payload.licenseId
    this.currentRevisionId = payload.currentRevisionId
  }
}
export interface EntityPayload extends AbstractUuidPayload {
  __typename: EntityType
  instance: Instance
  alias: string | null
  date: Scalars['DateTime']
  licenseId: number
  currentRevisionId: number | null
}
abstractEntitySchema.addTypeResolver<Entity>('AbstractEntity', (entity) => {
  return entity.__typename
})
export interface EntityRevisionPayload extends AbstractUuidPayload {
  __typename: EntityRevisionType
  date: Scalars['DateTime']
  authorId: number
  repositoryId: number
}
abstractEntitySchema.addTypeResolver<EntityRevision>(
  'AbstractEntityRevision',
  (revision) => {
    return revision.__typename
  }
)

export abstract class EntityRevision implements AbstractUuidPreResolver {
  public abstract __typename: EntityRevisionType
  public id: number
  public trashed: boolean
  public date: string
  public authorId: number
  public repositoryId: number

  public constructor(payload: EntityRevisionPayload) {
    this.id = payload.id
    this.trashed = payload.trashed
    this.date = payload.date
    this.authorId = payload.authorId
    this.repositoryId = payload.repositoryId
  }
}

export function addEntityResolvers<
  E extends Entity,
  R extends EntityRevision,
  EPayload extends EntityPayload,
  RPayload extends EntityRevisionPayload,
  ESetter extends keyof SerloDataSource,
  RSetter extends keyof SerloDataSource
>({
  schema,
  entityType,
  entityRevisionType,
  repository,
  Entity,
  EntityRevision,
  entitySetter,
  entityRevisionSetter,
}: EntityResolversPayload<E, R, ESetter, RSetter>) {
  schema.addResolver<E, unknown, Partial<R> | null>(
    entityType,
    'currentRevision',
    async (entity, _args, { dataSources }, info) => {
      if (!entity.currentRevisionId) return null
      const partialRevision = {
        id: entity.currentRevisionId,
      }
      if (requestsOnlyFields(entityRevisionType, ['id'], info)) {
        return partialRevision as Partial<R>
      }
      const data = await dataSources.serlo.getUuid(partialRevision)
      return new EntityRevision(data)
    }
  )
  schema.addResolver<E, unknown, Partial<License>>(
    entityType,
    'license',
    async (entity, _args, { dataSources }, info) => {
      const partialLicense = {
        id: entity.licenseId,
      }
      if (requestsOnlyFields('License', ['id'], info)) {
        return partialLicense
      }
      return dataSources.serlo.getLicense(partialLicense)
    }
  )

  schema.addResolver<R, unknown, Partial<UserPreResolver>>(
    entityRevisionType,
    'author',
    async (entityRevision, _args, { dataSources }, info) => {
      const partialUser = {
        id: entityRevision.authorId,
      }
      if (requestsOnlyFields('User', ['id'], info)) {
        return partialUser
      }
      const data = await dataSources.serlo.getUuid<UserPayload>(partialUser)
      return resolveUser(data)
    }
  )
  schema.addResolver<R, unknown, Partial<E>>(
    entityRevisionType,
    repository,
    async (entityRevision, _args, { dataSources }, info) => {
      const partialEntity = {
        id: entityRevision.repositoryId,
      }
      if (requestsOnlyFields(entityType, ['id'], info)) {
        return partialEntity as Partial<E>
      }
      const data = await dataSources.serlo.getUuid(partialEntity)
      return new Entity(data)
    }
  )

  schema.addMutation<unknown, EPayload, null>(
    `_set${entityType}`,
    async (_parent, payload, { dataSources, service }) => {
      if (service !== Service.Serlo) {
        throw new ForbiddenError(
          `You do not have the permissions to set a ${entityType}`
        )
      }
      await (dataSources.serlo[entitySetter] as (
        payload: EPayload
      ) => Promise<void>)(payload)
    }
  )
  schema.addMutation<unknown, RPayload, null>(
    `_set${entityRevisionType}`,
    async (_parent, payload, { dataSources, service }) => {
      if (service !== Service.Serlo) {
        throw new ForbiddenError(
          `You do not have the permissions to set a ${entityRevisionType}`
        )
      }
      await (dataSources.serlo[entityRevisionSetter] as (
        payload: RPayload
      ) => Promise<void>)(payload)
    }
  )
}
export interface EntityResolversPayload<
  E extends Entity,
  R extends EntityRevision,
  ESetter extends keyof SerloDataSource,
  RSetter extends keyof SerloDataSource
> {
  schema: Schema
  entityType: EntityType
  entityRevisionType: EntityRevisionType
  repository: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Entity: new (data: any) => E
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EntityRevision: new (data: any) => R
  entitySetter: ESetter
  entityRevisionSetter: RSetter
}
