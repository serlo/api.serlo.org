import * as serloAuth from '@serlo/authorization'
import { instanceToScope } from '@serlo/authorization'
import * as t from 'io-ts'
import * as R from 'ramda'

import { UuidResolver } from '../abstract-uuid/resolvers'
import { createTaxonomyTermLink } from '../taxonomy-term/resolvers'
import { autoreviewTaxonomyIds, defaultLicenseIds } from '~/config'
import { Context } from '~/context'
import { InternalServerError, UserInputError } from '~/errors'
import {
  Model,
  assertStringIsNotEmpty,
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
} from '~/internals/graphql'
import {
  CourseDecoder,
  EntityDecoder,
  EntityRevisionDecoder,
  EntityType,
  EntityTypeDecoder,
  NotificationEventType,
  PageDecoder,
  TaxonomyTermDecoder,
} from '~/model/decoder'
import { resolveConnection } from '~/schema/connection/utils'
import { createEvent } from '~/schema/events/event'
import { setSubscription } from '~/schema/subscription/resolvers'
import { Resolvers, SetAbstractEntityInput } from '~/types'
import { isDateString } from '~/utils'

type InputFields = keyof SetAbstractEntityInput

const mandatoryFieldsLookup: Record<EntityType, InputFields[]> = {
  [EntityType.Applet]: ['content', 'title', 'url'],
  [EntityType.Article]: ['content', 'title'],
  [EntityType.Course]: ['title'],
  [EntityType.CoursePage]: ['content', 'title'],
  [EntityType.Event]: ['content', 'title'],
  [EntityType.Exercise]: ['content'],
  [EntityType.ExerciseGroup]: ['content'],
  [EntityType.Page]: ['content', 'title'],
  [EntityType.Video]: ['title', 'url'],
} as const

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
      const { first = 100, after, instance = null } = payload

      if (first > LIMIT)
        throw new UserInputError(`'first' may not be higher than ${LIMIT}`)

      const deletedAfter = after
        ? decodeDateOfDeletion(after)
        : new Date('9999-12-31')

      const deletedEntities = await context.database.fetchAll<{
        id: number
        dateOfDeletion: Date
      }>(
        `
        SELECT
          uuid.id as id,
          MAX(event.date) AS dateOfDeletion
        FROM event
        JOIN uuid ON uuid.id = event.uuid_id
        JOIN entity ON entity.id = uuid.id
        JOIN instance ON instance.id = entity.instance_id
        WHERE uuid.id = event.uuid_id
            AND event.date < ?
            AND (? is null OR instance.subdomain = ?)
            AND event.event_type_id = 10
            AND uuid.trashed = 1
            AND entity.type_id NOT IN (35, 39, 40, 41, 42, 43, 44)
        GROUP BY uuid.id
        ORDER BY dateOfDeletion DESC
        LIMIT ?;
        `,
        [deletedAfter, instance, instance, first.toString()],
      )

      const nodes = await Promise.all(
        deletedEntities.map(async (node) => {
          return {
            entity: await UuidResolver.resolveWithDecoder(
              EntityDecoder,
              { id: node.id },
              context,
            ),
            dateOfDeletion: node.dateOfDeletion.toISOString(),
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
    async setAbstractEntity(_parent, { input }, context) {
      const { database, userId } = context

      assertUserIsAuthenticated(userId)

      const { entityType, changes, entityId, parentId } = input

      assertStringIsNotEmpty({ changes })

      if (!EntityTypeDecoder.is(entityType)) {
        throw new UserInputError('entityType must be a valid entity type')
      }

      assertStringIsNotEmpty(R.pick(mandatoryFieldsLookup[entityType], input))

      if (
        (entityId == null && parentId == null) ||
        (entityId != null && parentId != null)
      ) {
        throw new UserInputError(
          'Exactely one of entityId and parentId must be defined',
        )
      }

      let entity: Model<'AbstractEntity'>
      const transaction = await database.beginTransaction()

      try {
        if (parentId != null) {
          const parent = await UuidResolver.resolveWithDecoder(
            TaxonomyTermDecoder,
            { id: parentId },
            context,
          )

          const scope = instanceToScope(parent.instance)
          const guard =
            entityType === EntityType.Page
              ? serloAuth.Uuid.create('Page')(scope)
              : serloAuth.Uuid.create('Entity')(scope)

          await assertUserIsAuthorized({
            context,
            message: 'You are not allowed to create entities',
            guard,
          })

          const { insertId: newEntityId } = await database.mutate(
            'insert into uuid (trashed, discriminator) values (0, "entity")',
          )

          await database.mutate(
            `
            insert into entity (id, type_id, instance_id, license_id)
              select ?, type.id, instance.id, ?
              from type, instance
              where type.name = ? and instance.subdomain = ?`,
            [
              newEntityId,
              defaultLicenseIds[parent.instance],
              toDatabaseType(entityType),
              parent.instance,
            ],
          )

          await createTaxonomyTermLink(
            { entityId: newEntityId, taxonomyTermId: parent.id },
            context,
          )

          await createEvent(
            {
              __typename: NotificationEventType.CreateEntity,
              actorId: userId,
              instance: parent.instance,
              entityId: newEntityId,
            },
            context,
          )

          entity = await UuidResolver.resolveWithDecoder(
            EntityDecoder,
            { id: newEntityId },
            context,
          )

          await UuidResolver.removeCacheEntry({ id: parent.id }, context)
        } else {
          // This should not happen due to the check above
          if (entityId == null) throw new InternalServerError()

          entity = await UuidResolver.resolveWithDecoder(
            EntityDecoder,
            { id: entityId },
            context,
          )
        }

        const { insertId: revisionId } = await database.mutate(
          'insert into uuid (trashed, discriminator) values (0, "entityRevision")',
        )

        await database.mutate(
          `
          insert into entity_revision
            (id, author_id, repository_id, content, meta_title, meta_description,
              title, url, changes)
            values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            revisionId,
            userId,
            entity.id,
            input.content ?? null,
            input.metaTitle ?? null,
            input.metaDescription ?? null,
            input.title ?? null,
            input.url ?? null,
            input.changes ?? null,
          ],
        )

        const isAutoreview = await isAutoreviewEntity(entity, context)

        if (!input.needsReview || isAutoreview) {
          if (!isAutoreview) {
            await assertUserIsAuthorized({
              context,
              message: 'For needsReview = false you need review rights',
              guard: serloAuth.Entity.checkoutRevision(
                instanceToScope(entity.instance),
              ),
            })
          }

          await database.mutate(
            'update entity set current_revision_id = ? where id = ?',
            [revisionId, entity.id],
          )
        }

        await setSubscription(
          {
            subscribe: input.subscribeThis,
            sendEmail: input.subscribeThisByEmail,
            objectId: entity.id,
            userId,
          },
          context,
        )

        await createEvent(
          {
            __typename: NotificationEventType.CreateEntityRevision,
            actorId: userId,
            instance: entity.instance,
            entityId: entity.id,
            entityRevisionId: revisionId,
          },
          context,
        )

        await transaction.commit()

        await UuidResolver.removeCacheEntry({ id: entity.id }, context)

        const finalEntity = await UuidResolver.resolveWithDecoder(
          EntityDecoder,
          { id: entity.id },
          context,
        )

        const revision = await UuidResolver.resolveWithDecoder(
          EntityRevisionDecoder,
          { id: revisionId },
          context,
        )

        return {
          success: true,
          record: finalEntity,
          entity: finalEntity,
          revision,
          query: {},
        }
      } finally {
        await transaction.rollback()
      }
    },

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

      const scope = instanceToScope(entity.instance)
      const guard =
        entity.__typename === EntityType.Page
          ? serloAuth.Page.checkoutRevision(scope)
          : serloAuth.Entity.checkoutRevision(scope)

      await assertUserIsAuthorized({
        message: 'You are not allowed to check out the provided revision.',
        guard,
        context,
      })

      const transaction = await database.beginTransaction()

      try {
        await database.mutate(
          `update entity set current_revision_id = ? where id = ?`,
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
        await database.mutate(`update uuid set trashed = 1 where id = ?`, [
          revision.id,
        ])

        await createEvent(
          {
            __typename: NotificationEventType.RejectRevision,
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

        return { success: true, query: {} }
      } finally {
        await transaction.rollback()
      }
    },
  },
}

export async function resolveUnrevisedEntityIds(
  { userId = null }: { userId?: number | null },
  { database }: Pick<Context, 'database'>,
) {
  const rows = await database.fetchAll<{ id: number }>(
    `
    select
      entity.id
    from entity
    join uuid entity_uuid on entity_uuid.id = entity.id
    join (
      select
        revision.repository_id as entity_id,
        max(revision.id) as max_revision_id
      from entity_revision revision
      join uuid revision_uuid on revision.id = revision_uuid.id
      where
        revision_uuid.trashed = 0
        and (? is null or revision.author_id = ?)
      group by revision.repository_id
    ) as revision on revision.entity_id = entity.id
    where
      entity_uuid.trashed = 0
      and (entity.current_revision_id is null or
        entity.current_revision_id < revision.max_revision_id)
    order by max_revision_id
    `,
    [userId, userId],
  )

  return rows.map((row) => row.id)
}

function toDatabaseType(entityType: EntityType) {
  switch (entityType) {
    case EntityType.CoursePage:
      return 'course-page'
    case EntityType.ExerciseGroup:
      return 'exercise-group'
    default:
      return entityType.toLowerCase()
  }
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

  return new Date(dateOfDeletion)
}

async function isAutoreviewEntity(
  uuid: { id: number },
  context: Context,
): Promise<boolean> {
  if (PageDecoder.is(uuid)) return true
  if (autoreviewTaxonomyIds.includes(uuid.id)) return true

  if (t.type({ parentId: t.number }).is(uuid)) {
    if (uuid.parentId == null) return false
    const parent = await UuidResolver.resolve({ id: uuid.parentId }, context)

    return parent != null && (await isAutoreviewEntity(parent, context))
  } else if (t.type({ taxonomyTermIds: t.array(t.number) }).is(uuid)) {
    return (
      await Promise.all(
        uuid.taxonomyTermIds.map(async (id) => {
          const parent = await UuidResolver.resolve({ id }, context)
          return parent != null && (await isAutoreviewEntity(parent, context))
        }),
      )
    ).every((x) => x)
  } else {
    return false
  }
}
