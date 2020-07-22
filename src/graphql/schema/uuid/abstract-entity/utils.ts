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
