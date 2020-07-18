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
import { ForbiddenError, gql } from 'apollo-server'

import { SerloDataSource } from '../../data-sources/serlo'
import { DateTime } from '../date-time'
import { Instance } from '../instance'
import { License } from '../license'
import { Service } from '../types'
import { requestsOnlyFields, Schema } from '../utils'
import { Uuid, UuidPayload } from './abstract-uuid'
import { encodePath } from './alias'
import { resolveUser, User, UserPayload } from './user'

export const abstractEntitySchema = new Schema()

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

export abstract class Entity implements Uuid {
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
export interface EntityPayload extends UuidPayload {
  instance: Instance
  alias: string | null
  date: DateTime
  licenseId: number
  currentRevisionId: number | null
}
abstractEntitySchema.addTypeResolver<Entity>('Entity', (entity) => {
  return entity.__typename
})
abstractEntitySchema.addTypeDef(gql`
  """
  Represents a Serlo.org entity (e.g. an article). An \`Entity\` is tied to an \`Instance\`, has a \`License\`, might have an alias
  and is the child of \`TaxonomyTerm\`s
  """
  interface Entity {
    """
    The \`DateTime\` the entity has been created
    """
    date: DateTime!
    """
    The \`Instance\` the entity is tied to
    """
    instance: Instance!
    """
    The current alias of the entity
    """
    alias: String
    """
    The \`License\` of the entity
    """
    license: License!
  }
`)
export interface EntityRevisionPayload extends UuidPayload {
  date: DateTime
  authorId: number
  repositoryId: number
}
abstractEntitySchema.addTypeResolver<EntityRevision>(
  'EntityRevision',
  (revision) => {
    return revision.__typename
  }
)
abstractEntitySchema.addTypeDef(gql`
  """
  Represents a Serlo.org entity revision (e.g. a revision of an article). An \`EntityRevision\` is tied to an \`Entity\` and has an author.
  """
  interface EntityRevision {
    """
    The \`User\` that created the entity revision
    """
    author: User!
    """
    The \`DateTime\` the entity revision has been created
    """
    date: DateTime!
  }
`)

export abstract class EntityRevision implements Uuid {
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
  entityFields = '',
  entityPayloadFields = '',
  entityRevisionFields,
}: EntityResolversPayload<E, R, ESetter, RSetter>) {
  schema.addTypeDef(gql`
    type ${entityType} implements Uuid & Entity {
      id: Int!
      trashed: Boolean!
      instance: Instance!
      alias: String
      date: DateTime!
      license: License!
      currentRevision: ${entityRevisionType}
      ${entityFields}
    }
  `)
  schema.addResolver<E, unknown, Partial<R> | null>(
    entityType,
    'currentRevision',
    async (entity, _args, { dataSources }, info) => {
      if (!entity.currentRevisionId) return null
      const partialRevision = { id: entity.currentRevisionId }
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
      const partialLicense = { id: entity.licenseId }
      if (requestsOnlyFields('License', ['id'], info)) {
        return partialLicense
      }
      return dataSources.serlo.getLicense(partialLicense)
    }
  )

  schema.addTypeDef(gql`
    type ${entityRevisionType} implements Uuid & EntityRevision {
      id: Int!
      author: User!
      trashed: Boolean!
      date: DateTime!
      ${repository}: ${entityType}!
      ${entityRevisionFields}
    }
  `)
  schema.addResolver<R, unknown, Partial<User>>(
    entityRevisionType,
    'author',
    async (entityRevision, _args, { dataSources }, info) => {
      const partialUser = { id: entityRevision.authorId }
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
      const partialEntity = { id: entityRevision.repositoryId }
      if (requestsOnlyFields(entityType, ['id'], info)) {
        return partialEntity as Partial<E>
      }
      const data = await dataSources.serlo.getUuid(partialEntity)
      return new Entity(data)
    }
  )

  schema.addTypeDef(gql`
      extend type Mutation {
        _set${entityType}(
          id: Int!
          trashed: Boolean!
          instance: Instance!
          alias: String
          date: DateTime!
          currentRevisionId: Int
          licenseId: Int!
          ${entityPayloadFields}
        ): Boolean
      }
    `)

  schema.addTypeDef(gql`
      extend type Mutation {
        _set${entityRevisionType}(
          id: Int!
          trashed: Boolean!
          date: DateTime!
          authorId: Int!
          repositoryId: Int!
          ${entityRevisionFields}
        ): Boolean
     }
    `)
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
  entityFields?: string
  entityPayloadFields?: string
  entityRevisionFields: string
}
