import * as serloAuth from '@serlo/authorization'
import { instanceToScope } from '@serlo/authorization'
import * as t from 'io-ts'

import { createSetEntityResolver } from './entity-set-handler'
import { UuidResolver } from '../abstract-uuid/resolvers'
import { UserInputError } from '~/errors'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
} from '~/internals/graphql'
import { CourseDecoder, EntityDecoder } from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { Resolvers } from '~/types'
import { isDateString } from '~/utils'

export const resolvers: Resolvers = {
  Query: {
    entity: createNamespace(),
  },
  Mutation: {
    entity: createNamespace(),
  },
  AbstractEntity: {
    __resolveType(entity) {
      return entity.__typename
    },
  },
  AbstractEntityRevision: {
    __resolveType(entityRevision) {
      return entityRevision.__typename
    },
  },
  EntityQuery: {
    async deletedEntities(_parent, payload, context) {
      const LIMIT = 1000
      const { first = 100, after, instance } = payload

      if (first > LIMIT)
        throw new UserInputError(`'first' may not be higher than ${LIMIT}`)

      const deletedAfter = after ? decodeDateOfDeletion(after) : undefined

      const { deletedEntities } =
        await context.dataSources.model.serlo.getDeletedEntities({
          first: first + 1,
          after: deletedAfter,
          instance,
        })

      const nodes = await Promise.all(
        deletedEntities.map(async (node) => {
          return {
            entity: await UuidResolver.resolveWithDecoder(
              EntityDecoder,
              { id: node.id },
              context,
            ),
            dateOfDeletion: node.dateOfDeletion,
          }
        }),
      )

      return resolveConnection({
        nodes,
        payload,
        createCursor: (node) => {
          const { entity, dateOfDeletion } = node
          return JSON.stringify({ id: entity.id, dateOfDeletion })
        },
      })
    },
  },
  EntityMutation: {
    setAbstractEntity: createSetEntityResolver(),

    async sort(_parent, { input }, context) {
      const { dataSources, userId } = context
      assertUserIsAuthenticated(userId)

      const { entityId, childrenIds } = input

      const entity = await UuidResolver.resolveWithDecoder(
        CourseDecoder,
        { id: entityId },
        context,
      )
      await assertUserIsAuthorized({
        context,
        message:
          'You are not allowed to sort children of entities in this instance.',
        guard: serloAuth.Entity.orderChildren(
          serloAuth.instanceToScope(entity.instance),
        ),
      })

      // Provisory solution, See https://github.com/serlo/serlo.org-database-layer/issues/303
      const allChildrenIds = [...new Set(childrenIds.concat(entity.pageIds))]

      const { success } = await dataSources.model.serlo.sortEntity({
        entityId,
        childrenIds: allChildrenIds,
      })

      return { success, query: {} }
    },

    async updateLicense(_parent, { input }, context) {
      const { dataSources, userId } = context
      assertUserIsAuthenticated(userId)

      const { licenseId, entityId } = input

      const entity = await UuidResolver.resolveWithDecoder(
        EntityDecoder,
        { id: entityId },
        context,
      )
      await assertUserIsAuthorized({
        message: 'You are not allowed to set the license for this entity.',
        guard: serloAuth.Entity.updateLicense(instanceToScope(entity.instance)),
        context,
      })

      await dataSources.model.serlo.setEntityLicense({
        entityId,
        licenseId,
        userId,
      })

      return { success: true, query: {} }
    },

    async checkoutRevision(_parent, { input }, context) {
      const { dataSources, userId } = context
      assertUserIsAuthenticated(userId)

      const scope = await fetchScopeOfUuid({ id: input.revisionId }, context)
      await assertUserIsAuthorized({
        message: 'You are not allowed to check out the provided revision.',
        guard: serloAuth.Entity.checkoutRevision(scope),
        context,
      })

      await dataSources.model.serlo.checkoutEntityRevision({
        revisionId: input.revisionId,
        reason: input.reason,
        userId,
      })

      return { success: true, query: {} }
    },
    async rejectRevision(_parent, { input }, context) {
      const { dataSources, userId } = context
      assertUserIsAuthenticated(userId)

      const scope = await fetchScopeOfUuid({ id: input.revisionId }, context)
      await assertUserIsAuthorized({
        context,
        message: 'You are not allowed to reject the provided revision.',
        guard: serloAuth.Entity.rejectRevision(scope),
      })

      await dataSources.model.serlo.rejectEntityRevision({ ...input, userId })

      return { success: true, query: {} }
    },
  },
}

function decodeDateOfDeletion(after: string) {
  const afterParsed = JSON.parse(
    Buffer.from(after, 'base64').toString(),
  ) as unknown

  const dateOfDeletion = t.type({ dateOfDeletion: t.string }).is(afterParsed)
    ? afterParsed.dateOfDeletion
    : undefined

  if (!dateOfDeletion)
    throw new UserInputError(
      'Field `dateOfDeletion` as string is missing in `after`',
    )

  if (!isDateString(dateOfDeletion))
    throw new UserInputError(
      'The encoded dateOfDeletion in `after` should be a string in date format',
    )

  return new Date(dateOfDeletion).toISOString()
}
