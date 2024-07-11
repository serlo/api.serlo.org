import * as serloAuth from '@serlo/authorization'

import { UuidResolver } from '../abstract-uuid/resolvers'
import { Context } from '~/context'
import { InternalServerError, UserInputError } from '~/errors'
import {
  createNamespace,
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  assertStringIsNotEmpty,
  Model,
} from '~/internals/graphql'
import {
  DiscriminatorType,
  EntityDecoder,
  EntityType,
  NotificationEventType,
  TaxonomyTermDecoder,
} from '~/model/decoder'
import { resolveConnection } from '~/schema/connection/utils'
import { createEvent } from '~/schema/events/event'
import { createThreadResolvers } from '~/schema/thread/utils'
import { createUuidResolvers } from '~/schema/uuid/abstract-uuid/utils'
import { TaxonomyTermType, TaxonomyTypeCreateOptions, Resolvers } from '~/types'
import { isDefined } from '~/utils'

const typesMap = {
  root: TaxonomyTermType.Root,
  subject: TaxonomyTermType.Subject,
  topicFolder: TaxonomyTermType.ExerciseFolder,
  curriculumTopicFolder: TaxonomyTermType.ExerciseFolder,
  topic: TaxonomyTermType.Topic,
  // fallbacks
  blog: TaxonomyTermType.Topic,
  curriculum: TaxonomyTermType.Topic,
  curriculumTopic: TaxonomyTermType.Topic,
  forum: TaxonomyTermType.Topic,
  forumCategory: TaxonomyTermType.Topic,
  locale: TaxonomyTermType.Topic,
}

const ROOT_TAXONOMY_ID = 3

export const resolvers: Resolvers = {
  Mutation: {
    taxonomyTerm: createNamespace(),
  },
  TaxonomyTerm: {
    ...createUuidResolvers(),
    ...createThreadResolvers(),
    async type(taxonomyTerm, _args, context) {
      if (!taxonomyTerm.parentId) return TaxonomyTermType.Root
      const parent = await UuidResolver.resolveWithDecoder(
        TaxonomyTermDecoder,
        { id: taxonomyTerm.parentId },
        context,
      )
      if (!parent.parentId) return TaxonomyTermType.Subject
      return typesMap[taxonomyTerm.type]
    },
    async path(taxonomyTerm, _args, context) {
      return await getParentTerms(taxonomyTerm, [], context)
    },
    parent(taxonomyTerm, _args, context) {
      if (!taxonomyTerm.parentId) return null
      return UuidResolver.resolveWithDecoder(
        TaxonomyTermDecoder,
        { id: taxonomyTerm.parentId },
        context,
      )
    },
    async children(taxonomyTerm, cursorPayload, context) {
      const children = await Promise.all(
        taxonomyTerm.childrenIds.map((id) =>
          UuidResolver.resolve({ id }, context),
        ),
      )
      return resolveConnection({
        nodes: children.filter(isDefined),
        payload: cursorPayload,
        createCursor(node) {
          return node.id.toString()
        },
      })
    },
  },
  TaxonomyTermMutation: {
    async create(_parent, { input }, context) {
      const { database, userId } = context

      const { parentId, name, description = null } = input
      const taxonomyType =
        input.taxonomyType === TaxonomyTypeCreateOptions.ExerciseFolder
          ? 'topic-folder'
          : 'topic'

      assertUserIsAuthenticated(userId)
      assertStringIsNotEmpty({ name })

      const parent = await UuidResolver.resolve({ id: parentId }, context)

      if (parent?.__typename != DiscriminatorType.TaxonomyTerm) {
        throw new UserInputError(`parent with ${parentId} is no taxonomy term`)
      }

      if (parent.type === 'topicFolder') {
        throw new UserInputError(`parent ${parentId} is an exercise folder`)
      }

      await assertUserIsAuthorized({
        context,
        message: 'You are not allowed create taxonomy terms.',
        guard: serloAuth.Uuid.create('TaxonomyTerm')(
          serloAuth.instanceToScope(parent.instance),
        ),
      })

      const transaction = await database.beginTransaction()

      try {
        const { insertId: taxonomyId } = await database.mutate(
          'insert into uuid (trashed, discriminator) values (0, "taxonomyTerm")',
        )

        if (taxonomyId <= 0) {
          throw new InternalServerError('no uuid entry could be created')
        }

        const { currentHeaviest } = await database.fetchOne<{
          currentHeaviest: number
        }>(
          `
          SELECT IFNULL(MAX(taxonomy.weight), 0) AS currentHeaviest
            FROM taxonomy
            WHERE taxonomy.parent_id = ?
          `,
          [parentId],
        )

        await database.mutate(
          `
          insert into taxonomy
            (id, type_id, instance_id, parent_id, description, weight, name)
          select ?, type.id, instance.id, ?, ?, ?, ?
          from type, instance
          where type.name = ? and instance.subdomain = ?
          `,
          [
            taxonomyId,
            parentId,
            description,
            currentHeaviest + 1,
            name,
            taxonomyType,
            parent.instance,
          ],
        )

        const record = await UuidResolver.resolve({ id: taxonomyId }, context)

        if (record?.__typename !== DiscriminatorType.TaxonomyTerm) {
          throw new InternalServerError('taxonomy term could not be created')
        }

        await createEvent(
          {
            __typename: NotificationEventType.CreateTaxonomyTerm,
            actorId: userId,
            taxonomyTermId: taxonomyId,
            instance: record.instance,
          },
          context,
        )

        await UuidResolver.removeCacheEntry({ id: record.parentId! }, context)
        await UuidResolver.removeCacheEntry({ id: record.id }, context)
        await transaction.commit()

        return { success: true, record, query: {} }
      } finally {
        await transaction.rollback()
      }
    },
    async createEntityLinks(_parent, { input }, context) {
      const { database, userId } = context
      assertUserIsAuthenticated(userId)

      const { entityIds, taxonomyTermId } = input

      const taxonomyTerm = await UuidResolver.resolve(
        { id: taxonomyTermId },
        context,
      )
      const entities = await Promise.all(
        entityIds.map((id) => UuidResolver.resolve({ id }, context)),
      )

      if (
        taxonomyTerm == null ||
        taxonomyTerm.__typename !== DiscriminatorType.TaxonomyTerm
      ) {
        throw new UserInputError('termTaxonomyId must belong to taxonomy')
      }

      const canBeLinked = (entity: (typeof entities)[number]) => {
        if (!EntityDecoder.is(entity)) return false
        if (entity.__typename === EntityType.CoursePage) return false
        if (entity.instance !== taxonomyTerm.instance) return false
        if (
          taxonomyTerm.type === 'topicFolder' &&
          entity.__typename !== EntityType.Exercise &&
          entity.__typename !== EntityType.ExerciseGroup
        ) {
          return false
        }
        if (
          taxonomyTerm.type !== 'topicFolder' &&
          (entity.__typename === EntityType.Exercise ||
            entity.__typename === EntityType.ExerciseGroup)
        ) {
          return false
        }
        return true
      }

      if (entities.some((entity) => !canBeLinked(entity))) {
        throw new UserInputError(
          'At least one child cannot be added to the taxonomy',
        )
      }

      await assertUserIsAuthorized({
        message: 'You are not allowed to link entities to this taxonomy term.',
        guard: serloAuth.TaxonomyTerm.change(
          serloAuth.instanceToScope(taxonomyTerm.instance),
        ),
        context,
      })

      const transaction = await database.beginTransaction()

      try {
        for (const entity of entities) {
          if (
            !EntityDecoder.is(entity) ||
            entity.__typename === EntityType.CoursePage ||
            entity.taxonomyTermIds.includes(taxonomyTermId)
          ) {
            continue
          }

          await createTaxonomyTermLink(
            { entityId: entity.id, taxonomyTermId },
            context,
          )
        }

        await transaction.commit()

        await UuidResolver.removeCacheEntries(
          entityIds.map((id) => ({ id })),
          context,
        )
        await UuidResolver.removeCacheEntry({ id: taxonomyTermId }, context)

        return { success: true, query: {} }
      } finally {
        await transaction.rollback()
      }
    },
    async deleteEntityLinks(_parent, { input }, context) {
      const { database, userId } = context
      assertUserIsAuthenticated(userId)

      const { entityIds, taxonomyTermId } = input

      const entities = await Promise.all(
        entityIds.map((id) => UuidResolver.resolve({ id }, context)),
      )
      const taxonomyTerm = await UuidResolver.resolveWithDecoder(
        TaxonomyTermDecoder,
        { id: taxonomyTermId },
        context,
      )

      if (
        entities.some(
          (entity) =>
            !EntityDecoder.is(entity) ||
            entity.__typename === EntityType.CoursePage ||
            entity.taxonomyTermIds.length <= 1,
        )
      ) {
        throw new UserInputError(
          'All children must be entities (beside course pages) and must have more than one parent',
        )
      }

      await assertUserIsAuthorized({
        message:
          'You are not allowed to unlink entities from this taxonomy term.',
        guard: serloAuth.TaxonomyTerm.change(
          serloAuth.instanceToScope(taxonomyTerm.instance),
        ),
        context,
      })

      const transaction = await database.beginTransaction()

      try {
        for (const entityId of entityIds) {
          await database.mutate(
            `
              delete from term_taxonomy_entity
              where entity_id = ? and term_taxonomy_id = ?
            `,
            [entityId, taxonomyTermId],
          )

          await createEvent(
            {
              __typename: NotificationEventType.RemoveTaxonomyLink,
              actorId: userId,
              instance: taxonomyTerm.instance,
              parentId: taxonomyTermId,
              childId: entityId,
            },
            context,
          )
        }

        await transaction.commit()

        await UuidResolver.removeCacheEntries(
          entityIds.map((id) => ({ id })),
          context,
        )
        await UuidResolver.removeCacheEntry({ id: taxonomyTermId }, context)

        return { success: true, query: {} }
      } finally {
        await transaction.rollback()
      }
    },
    async sort(_parent, { input }, context) {
      const { database, userId } = context
      assertUserIsAuthenticated(userId)

      const { childrenIds, taxonomyTermId } = input

      const taxonomyTerm = await UuidResolver.resolveWithDecoder(
        TaxonomyTermDecoder,
        { id: taxonomyTermId },
        context,
      )

      await assertUserIsAuthorized({
        message:
          'You are not allowed to sort children of taxonomy terms in this instance.',
        guard: serloAuth.TaxonomyTerm.change(
          serloAuth.instanceToScope(taxonomyTerm.instance),
        ),
        context,
      })

      if (
        childrenIds.some(
          (childId) => !taxonomyTerm.childrenIds.includes(childId),
        )
      ) {
        throw new UserInputError(
          'children_ids have to be a subset of children entities and taxonomy terms of the given taxonomy term',
        )
      }

      const transaction = await database.beginTransaction()

      try {
        await Promise.all(
          childrenIds.map(async (childId, position) => {
            // Since the id of entities and taxonomies is always different
            // we do not need to distinguish between them

            await database.mutate(
              'update taxonomy set weight = ? where parent_id = ? and id = ?',
              [position, taxonomyTermId, childId],
            )

            await database.mutate(
              'update term_taxonomy_entity set position = ? where term_taxonomy_id = ? and entity_id = ?',
              [position, taxonomyTermId, childId],
            )
          }),
        )

        await UuidResolver.removeCacheEntry({ id: taxonomyTermId }, context)
        await createEvent(
          {
            __typename: NotificationEventType.SetTaxonomyTerm,
            taxonomyTermId,
            actorId: userId,
            instance: taxonomyTerm.instance,
          },
          context,
        )

        await transaction.commit()

        return { success: true, query: {} }
      } finally {
        await transaction.rollback()
      }
    },
    async setNameAndDescription(_parent, { input }, context) {
      const { database, userId } = context
      assertUserIsAuthenticated(userId)

      const { name } = input

      assertStringIsNotEmpty({ name })

      const taxonomyTerm = await UuidResolver.resolve(input, context)

      if (
        taxonomyTerm == null ||
        taxonomyTerm.__typename !== DiscriminatorType.TaxonomyTerm
      ) {
        throw new UserInputError(`Taxonomy term ${input.id} does not exists`)
      }

      await assertUserIsAuthorized({
        message:
          'You are not allowed to set name or description of this taxonomy term.',
        guard: serloAuth.TaxonomyTerm.set(
          serloAuth.instanceToScope(taxonomyTerm.instance),
        ),
        context,
      })

      await database.mutate(
        `
          UPDATE taxonomy
          SET name = ?, description = ?
          WHERE taxonomy.id = ?;
        `,
        [input.name, input.description, input.id],
      )

      await createEvent(
        {
          __typename: NotificationEventType.SetTaxonomyTerm,
          taxonomyTermId: input.id,
          actorId: userId,
          instance: taxonomyTerm.instance,
        },
        context,
      )
      await UuidResolver.removeCacheEntry(input, context)

      return { success: true, query: {} }
    },
  },
}

export async function createTaxonomyTermLink(
  { entityId, taxonomyTermId }: { entityId: number; taxonomyTermId: number },
  { database }: Pick<Context, 'database'>,
) {
  const { lastPosition } = await database.fetchOne<{
    lastPosition: number
  }>(
    `
              SELECT IFNULL(MAX(position), 0) as lastPosition
                FROM term_taxonomy_entity
                WHERE term_taxonomy_id = ?`,
    [taxonomyTermId],
  )

  await database.mutate(
    `
            insert into term_taxonomy_entity (entity_id, term_taxonomy_id, position)
              values (?,?,?)
          `,
    [entityId, taxonomyTermId, lastPosition + 1],
  )
}

async function getParentTerms(
  taxonomyTerm: Model<'TaxonomyTerm'>,
  parentTerms: Model<'TaxonomyTerm'>[],
  context: Context,
) {
  if (taxonomyTerm.parentId && taxonomyTerm.parentId !== ROOT_TAXONOMY_ID) {
    const parent = await UuidResolver.resolveWithDecoder(
      TaxonomyTermDecoder,
      { id: taxonomyTerm.parentId },
      context,
    )
    parentTerms.unshift(parent)

    await getParentTerms(parent, parentTerms, context)
  }

  return parentTerms
}
