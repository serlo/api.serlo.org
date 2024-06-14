import * as serloAuth from '@serlo/authorization'
import { instanceToScope } from '@serlo/authorization'

import { UuidResolver } from '../abstract-uuid/resolvers'
import {
  assertStringIsNotEmpty,
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
} from '~/internals/graphql'
import { PageDecoder, PageRevisionDecoder } from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import { resolvers as EntityResolvers } from '~/schema/uuid/abstract-entity/resolvers'
import {
  createRepositoryResolvers,
  createRevisionResolvers,
} from '~/schema/uuid/abstract-repository/utils'
import { createTaxonomyTermChildResolvers } from '~/schema/uuid/abstract-taxonomy-term-child/utils'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  Query: {
    page: createNamespace(),
  },
  Mutation: {
    page: createNamespace(),
  },
  Page: {
    ...createRepositoryResolvers({ revisionDecoder: PageRevisionDecoder }),
    ...createTaxonomyTermChildResolvers(),
  },
  PageRevision: createRevisionResolvers({ repositoryDecoder: PageDecoder }),
  PageMutation: {
    async addRevision(_parent, { input }, context) {
      const { dataSources, userId } = context
      assertUserIsAuthenticated(userId)

      const { pageId, content, title } = input

      assertStringIsNotEmpty({ content, title })

      const scope = await fetchScopeOfUuid({ id: pageId }, context)
      await assertUserIsAuthorized({
        message: 'You are not allowed to add revision to this page.',
        guard: serloAuth.Uuid.create('PageRevision')(scope),
        context,
      })

      const { success, revisionId } =
        await dataSources.model.serlo.addPageRevision({
          userId,
          ...input,
        })

      return { success, revisionId, query: {} }
    },
    async checkoutRevision(_parent, { input }, context) {
      const { dataSources, userId } = context
      assertUserIsAuthenticated(userId)

      const scope = await fetchScopeOfUuid({ id: input.revisionId }, context)

      await assertUserIsAuthorized({
        message: 'You are not allowed to check out the provided revision.',
        guard: serloAuth.Page.checkoutRevision(scope),
        context,
      })

      await dataSources.model.serlo.checkoutPageRevision({
        revisionId: input.revisionId,
        reason: input.reason,
        userId,
      })

      return { success: true, query: {} }
    },
    async create(_parent, { input }, context, info) {
      context.userId = 1
      const { userId, database } = context
      assertUserIsAuthenticated(userId)

      const { content, title, instance } = input

      assertStringIsNotEmpty({ content, title })

      await assertUserIsAuthorized({
        message: 'You are not allowed to create pages.',
        guard: serloAuth.Uuid.create('Page')(instanceToScope(instance)),
        context,
      })

      const resolver = EntityResolvers.EntityMutation!.setAbstractEntity!

      if (typeof resolver !== 'function') {
        throw new Error('Resolver is not a function')
      }

      const { taxonomyId } = await database.fetchOne<{ taxonomyId: number }>(
        `
        select
          taxonomy.id as taxonomyId
        from taxonomy
        join instance on taxonomy.instance_id = instance.id
        where taxonomy.name = 'Static Pages' and instance.subdomain = ?
        `,
        [instance],
      )

      return resolver(
        {},
        {
          input: {
            entityType: 'Page',
            changes: 'Initial page creation',
            subscribeThis: false,
            subscribeThisByEmail: false,
            needsReview: false,
            parentId: taxonomyId,
            content,
            title,
            metaDescription: undefined,
            metaTitle: undefined,
            url: undefined,
          },
        },
        context,
        info,
      )
    },
  },
  PageQuery: {
    async pages(_parent, payload, context) {
      const pages = await context.database.fetchAll<{ id: number }>(
        `
        select entity.id
        from entity
        join type on entity.type_id = type.id
        join instance on entity.instance_id = instance.id
        where type.name = 'page'
          and (? is null or instance.subdomain = ?)
        order by entity.id desc`,
        [payload.instance, payload.instance],
      )

      return await Promise.all(
        pages.map((page) =>
          UuidResolver.resolveWithDecoder(PageDecoder, page, context),
        ),
      )
    },
  },
}
