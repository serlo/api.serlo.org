import * as serloAuth from '@serlo/authorization'

import {
  TypeResolvers,
  Mutations,
  createNamespace,
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  assertStringIsNotEmpty,
} from '~/internals/graphql'
import { TaxonomyTermDecoder } from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { createThreadResolvers } from '~/schema/thread/utils'
import { createUuidResolvers } from '~/schema/uuid/abstract-uuid/utils'
import {
  TaxonomyTerm,
  TaxonomyTermType,
  TaxonomyTypeCreateOptions,
} from '~/types'
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

export const resolvers: TypeResolvers<TaxonomyTerm> &
  Mutations<'taxonomyTerm'> = {
  Mutation: {
    taxonomyTerm: createNamespace(),
  },
  TaxonomyTerm: {
    ...createUuidResolvers(),
    ...createThreadResolvers(),
    async type(taxonomyTerm, _args, { dataSources }) {
      if (!taxonomyTerm.parentId) return TaxonomyTermType.Root
      const parent = await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: taxonomyTerm.parentId,
        decoder: TaxonomyTermDecoder,
      })
      if (!parent.parentId) return TaxonomyTermType.Subject
      return typesMap[taxonomyTerm.type]
    },
    async path(taxonomyTerm, _args, { dataSources }) {
      const parentTerms = []
      let currentTerm = taxonomyTerm

      while (true) {
        if (!currentTerm.parentId) break

        const parent = await dataSources.model.serlo.getUuidWithCustomDecoder({
          id: currentTerm.parentId,
          decoder: TaxonomyTermDecoder,
        })
        parentTerms.unshift(parent)
        currentTerm = parent
      }

      return parentTerms
    },
    parent(taxonomyTerm, _args, { dataSources }) {
      if (!taxonomyTerm.parentId) return null
      return dataSources.model.serlo.getUuidWithCustomDecoder({
        id: taxonomyTerm.parentId,
        decoder: TaxonomyTermDecoder,
      })
    },
    async children(taxonomyTerm, cursorPayload, { dataSources }) {
      const children = await Promise.all(
        taxonomyTerm.childrenIds.map((id) => {
          // TODO: Use getUuidWithCustomDecoder()
          return dataSources.model.serlo.getUuid({ id })
        }),
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
    async create(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { parentId, name, taxonomyType, description = undefined } = input

      assertStringIsNotEmpty({ name })

      const scope = await fetchScopeOfUuid({
        id: parentId,
        dataSources,
      })

      await assertUserIsAuthorized({
        userId,
        dataSources,
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
    async createEntityLinks(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { entityIds, taxonomyTermId } = input

      const scope = await fetchScopeOfUuid({
        id: taxonomyTermId,
        dataSources,
      })

      await assertUserIsAuthorized({
        userId,
        dataSources,
        message: 'You are not allowed to link entities to this taxonomy term.',
        guard: serloAuth.TaxonomyTerm.change(scope),
      })

      const { success } = await dataSources.model.serlo.linkEntitiesToTaxonomy({
        entityIds,
        taxonomyTermId,
        userId,
      })

      return { success, query: {} }
    },
    async deleteEntityLinks(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { entityIds, taxonomyTermId } = input

      const scope = await fetchScopeOfUuid({
        id: taxonomyTermId,
        dataSources,
      })

      await assertUserIsAuthorized({
        userId,
        dataSources,
        message:
          'You are not allowed to unlink entities from this taxonomy term.',
        guard: serloAuth.TaxonomyTerm.change(scope),
      })

      const { success } =
        await dataSources.model.serlo.unlinkEntitiesFromTaxonomy({
          entityIds,
          taxonomyTermId,
          userId,
        })

      return { success, query: {} }
    },
    async sort(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { childrenIds, taxonomyTermId } = input

      const taxonomyTerm =
        await dataSources.model.serlo.getUuidWithCustomDecoder({
          id: taxonomyTermId,
          decoder: TaxonomyTermDecoder,
        })

      await assertUserIsAuthorized({
        userId,
        dataSources,
        message:
          'You are not allowed to sort children of taxonomy terms in this instance.',
        guard: serloAuth.TaxonomyTerm.change(
          serloAuth.instanceToScope(taxonomyTerm.instance),
        ),
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
    async setNameAndDescription(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { id, name, description = null } = input

      assertStringIsNotEmpty({ name })

      const scope = await fetchScopeOfUuid({
        id,
        dataSources,
      })

      await assertUserIsAuthorized({
        userId,
        dataSources,
        message:
          'You are not allowed to set name or description of this taxonomy term.',
        guard: serloAuth.TaxonomyTerm.set(scope),
      })

      const { success } =
        await dataSources.model.serlo.setTaxonomyTermNameAndDescription({
          id,
          name,
          description,
          userId,
        })

      return { success, query: {} }
    },
  },
}
