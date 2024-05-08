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
import {
  CourseDecoder,
  EntityDecoder,
  EntityRevisionDecoder,
  NotificationEventType,
} from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { createEvent } from '~/schema/events/event'
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
      const { userId, database } = context
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

      const transaction = await database.beginTransaction()

      try {
        await database.mutate('update entity set license_id = ? where id = ?', [
          licenseId,
          entityId,
        ])

        await createEvent(
          {
            __typename: NotificationEventType.SetLicense,
            actorId: userId,
            repositoryId: entity.id,
            instance: entity.instance,
          },
          context,
        )

        await transaction.commit()

        await UuidResolver.removeCacheEntry({ id: entity.id }, context)

        return { success: true, query: {} }
      } finally {
        await transaction.rollback()
      }
    },

    async checkoutRevision(_parent, { input }, context) {
      const { database, userId } = context
      assertUserIsAuthenticated(userId)

      const revision = await UuidResolver.resolveWithDecoder(
        EntityRevisionDecoder,
        { id: input.revisionId },
        context,
      )
      const entity = await UuidResolver.resolveWithDecoder(
        EntityDecoder,
        { id: revision.repositoryId },
        context,
      )

      await assertUserIsAuthorized({
        message: 'You are not allowed to check out the provided revision.',
        guard: serloAuth.Entity.checkoutRevision(
          instanceToScope(entity.instance),
        ),
        context,
      })

      const transaction = await database.beginTransaction()

      try {
        await database.mutate(
          `update entity set current_revision = ? where id = ?`,
          [revision.id, entity.id],
        )

        await database.mutate(`update uuid set trashed = 0 where id = ?`, [
          revision.id,
        ])

        await createEvent(
          {
            __typename: NotificationEventType.CheckoutRevision,
            actorId: userId,
            instance: entity.instance,
            repositoryId: entity.id,
            revisionId: revision.id,
            reason: input.reason,
          },
          context,
        )

        await transaction.commit()

        await UuidResolver.removeCacheEntry({ id: entity.id }, context)
        await UuidResolver.removeCacheEntry({ id: revision.id }, context)

        // TODO: UnrevisedRevisions

        return { success: true, query: {} }
      } finally {
        await transaction.rollback()
      }
    },

    async rejectRevision(_parent, { input }, context) {
      const { database, userId } = context
      assertUserIsAuthenticated(userId)

      const revision = await UuidResolver.resolveWithDecoder(
        EntityRevisionDecoder,
        { id: input.revisionId },
        context,
      )
      const entity = await UuidResolver.resolveWithDecoder(
        EntityDecoder,
        { id: revision.repositoryId },
        context,
      )

      await assertUserIsAuthorized({
        context,
        message: 'You are not allowed to reject the provided revision.',
        guard: serloAuth.Entity.rejectRevision(
          instanceToScope(entity.instance),
        ),
      })

      const transaction = await database.beginTransaction()

      try {
        await database.mutate(
          `update entity set current_revision = ? where id = ?`,
          [revision.id, entity.id],
        )

        await database.mutate(`update uuid set trashed = 0 where id = ?`, [
          revision.id,
        ])

        await createEvent(
          {
            __typename: NotificationEventType.CheckoutRevision,
            actorId: userId,
            instance: entity.instance,
            repositoryId: entity.id,
            revisionId: revision.id,
            reason: input.reason,
          },
          context,
        )

        await transaction.commit()

        await UuidResolver.removeCacheEntry({ id: entity.id }, context)
        await UuidResolver.removeCacheEntry({ id: revision.id }, context)

        // TODO: UnrevisedRevisions

        return { success: true, query: {} }
      } finally {
        await transaction.rollback()
      }
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
