import * as serloAuth from '@serlo/authorization'

import { UuidResolver } from '../abstract-uuid/resolvers'
import { Context } from '~/context'
import { UserInputError } from '~/errors'
import {
  createNamespace,
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  assertStringIsNotEmpty,
  Model,
} from '~/internals/graphql'
import { TaxonomyTermDecoder } from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
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
      const { dataSources, userId } = context
      assertUserIsAuthenticated(userId)

      const { parentId, name, taxonomyType, description = undefined } = input

      assertStringIsNotEmpty({ name })

      const scope = await fetchScopeOfUuid({ id: parentId }, context)

      await assertUserIsAuthorized({
        context,
        message: 'You are not allowed create taxonomy terms.',
        guard: serloAuth.Uuid.create('TaxonomyTerm')(scope),
      })

      const taxonomyTerm = await dataSources.model.serlo.createTaxonomyTerm({
        parentId,
        taxonomyType:
          taxonomyType === TaxonomyTypeCreateOptions.ExerciseFolder
            ? 'topic-folder'
            : 'topic',
        name,
        description,
        userId,
      })

      return {
        success: taxonomyTerm ? true : false,
        record: taxonomyTerm,
        query: {},
      }
    },
    async createEntityLinks(_parent, { input }, context) {
      const { dataSources, userId } = context
      assertUserIsAuthenticated(userId)

      const { entityIds, taxonomyTermId } = input

      const scope = await fetchScopeOfUuid({ id: taxonomyTermId }, context)

      await assertUserIsAuthorized({
        message: 'You are not allowed to link entities to this taxonomy term.',
        guard: serloAuth.TaxonomyTerm.change(scope),
        context,
      })

      const { success } = await dataSources.model.serlo.linkEntitiesToTaxonomy({
        entityIds,
        taxonomyTermId,
        userId,
      })

      return { success, query: {} }
    },
    async deleteEntityLinks(_parent, { input }, context) {
      const { dataSources, userId } = context
      assertUserIsAuthenticated(userId)

      const { entityIds, taxonomyTermId } = input

      const scope = await fetchScopeOfUuid({ id: taxonomyTermId }, context)

      await assertUserIsAuthorized({
        message:
          'You are not allowed to unlink entities from this taxonomy term.',
        guard: serloAuth.TaxonomyTerm.change(scope),
        context,
      })

      const { success } =
        await dataSources.model.serlo.unlinkEntitiesFromTaxonomy({
          entityIds,
          taxonomyTermId,
          userId,
        })

      return { success, query: {} }
    },
    async sort(_parent, { input }, context) {
      const { dataSources, userId } = context
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

      // Provisory solution, See https://github.com/serlo/serlo.org-database-layer/issues/303
      const allChildrenIds = [
        ...new Set(childrenIds.concat(taxonomyTerm.childrenIds)),
      ]

      const { success } = await dataSources.model.serlo.sortTaxonomyTerm({
        childrenIds: allChildrenIds,
        taxonomyTermId,
        userId,
      })

      return { success, query: {} }
    },
    async setNameAndDescription(_parent, { input }, context) {
      const { database, userId } = context
      assertUserIsAuthenticated(userId)

      const { id, name } = input

      assertStringIsNotEmpty({ name })

      const scope = await fetchScopeOfUuid({ id }, context)

      await assertUserIsAuthorized({
        message:
          'You are not allowed to set name or description of this taxonomy term.',
        guard: serloAuth.TaxonomyTerm.set(scope),
        context,
      })

      const { affectedRows } = await database.mutate(
        `
          UPDATE term
          JOIN term_taxonomy ON term.id = term_taxonomy.term_id
          SET term.name = ?,
              term_taxonomy.description = ?
          WHERE term_taxonomy.id = ?;
        `,
        [input.name, input.description, input.id],
      )

      if (affectedRows === 0) {
        throw new UserInputError(`Taxonomy term ${input.id} does not exists`)
      }

      await UuidResolver.removeCacheEntry(input, context)

      return { success: true, query: {} }
    },
  },
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
