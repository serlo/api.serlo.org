import { ForbiddenError, gql } from 'apollo-server'

import { SerloDataSource } from '../../data-sources/serlo'
import { DateTime } from '../date-time'
import { Instance } from '../instance'
import { License, licenseSchema } from '../license'
import { Service } from '../types'
import { requestsOnlyFields, Schema } from '../utils'
import { Uuid } from './abstract-uuid'
import { User } from './user'

export const abstractEntitySchema = new Schema()

export enum EntityType {
  Article = 'Article',
  Exercise = 'Exercise',
  ExerciseGroup = 'ExerciseGroup',
  GroupedExercise = 'GroupedExercise',
  Solution = 'Solution',
}

export enum EntityRevisionType {
  ArticleRevision = 'ArticleRevision',
  ExerciseRevision = 'ExerciseRevision',
  ExerciseGroupRevision = 'ExerciseGroupRevision',
  GroupedExerciseRevision = 'GroupedExerciseRevision',
  SolutionRevision = 'SolutionRevision',
}

export abstract class Entity extends Uuid {
  public abstract __typename: EntityType
  public instance: Instance
  public alias: string | null
  public date: string
  public licenseId: number
  public currentRevisionId: number | null

  public constructor(payload: EntityPayload) {
    super(payload)
    this.instance = payload.instance
    this.alias = payload.alias
    this.date = payload.date
    this.licenseId = payload.licenseId
    this.currentRevisionId = payload.currentRevisionId
  }
}
export interface EntityPayload {
  id: number
  trashed: boolean
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
export interface EntityRevisionPayload {
  id: number
  trashed: boolean
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

export abstract class EntityRevision extends Uuid {
  public abstract __typename: EntityRevisionType
  public date: string
  public authorId: number
  public repositoryId: number

  public constructor(payload: EntityRevisionPayload) {
    super(payload)
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
  entitySetter,
  entityRevisionSetter,
}: {
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
  entitySetter: ESetter
  entityRevisionSetter: RSetter
}) {
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
    async (entity, _args, context, info) => {
      const partialLicense = { id: entity.licenseId }
      if (requestsOnlyFields('License', ['id'], info)) {
        return partialLicense
      }
      return licenseSchema.resolvers.Query.license(
        undefined,
        partialLicense,
        context,
        info
      )
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
      const data = await dataSources.serlo.getUuid(partialUser)
      return new User(data)
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

  schema.addMutation<unknown, EPayload, null>(
    `_set${entityType}`,
    (_parent, payload, { dataSources, service }) => {
      if (service !== Service.Serlo) {
        throw new ForbiddenError(
          `You do not have the permissions to set a ${entityType}`
        )
      }

      return dataSources.serlo[entitySetter](payload)
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

  schema.addMutation<unknown, RPayload, null>(
    `_set${entityRevisionType}`,
    (_parent, payload, { dataSources, service }) => {
      if (service !== Service.Serlo) {
        throw new ForbiddenError(
          `You do not have the permissions to set a ${entityRevisionType}`
        )
      }

      return dataSources.serlo[entityRevisionSetter](payload)
    }
  )
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
