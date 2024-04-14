import * as serloAuth from '@serlo/authorization'
import { instanceToScope } from '@serlo/authorization'

import {
  assertStringIsNotEmpty,
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  Mutations,
  Queries,
  TypeResolvers,
} from '~/internals/graphql'
import { castToUuid, PageDecoder, PageRevisionDecoder } from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import {
  createRepositoryResolvers,
  createRevisionResolvers,
} from '~/schema/uuid/abstract-repository/utils'
import { Page, PageRevision } from '~/types'

export const resolvers: TypeResolvers<Page> &
  TypeResolvers<PageRevision> &
  Queries<'page'> &
  Mutations<'page'> = {
  Query: {
    page: createNamespace(),
  },
  Mutation: {
    page: createNamespace(),
  },
  Page: createRepositoryResolvers({ revisionDecoder: PageRevisionDecoder }),
  PageRevision: createRevisionResolvers({ repositoryDecoder: PageDecoder }),
  PageMutation: {
    async addRevision(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { pageId, content, title } = input

      assertStringIsNotEmpty({ content, title })

      const scope = await fetchScopeOfUuid({
        id: pageId,
        dataSources,
      })
      await assertUserIsAuthorized({
        userId,
        dataSources,
        message: 'You are not allowed to add revision to this page.',
        guard: serloAuth.Uuid.create('PageRevision')(scope),
      })

      const { success, revisionId } =
        await dataSources.model.serlo.addPageRevision({
          userId,
          ...input,
        })

      return { success, revisionId, query: {} }
    },
    async checkoutRevision(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const scope = await fetchScopeOfUuid({
        id: input.revisionId,
        dataSources,
      })

      await assertUserIsAuthorized({
        userId,
        dataSources,
        message: 'You are not allowed to check out the provided revision.',
        guard: serloAuth.Page.checkoutRevision(scope),
      })

      await dataSources.model.serlo.checkoutPageRevision({
        revisionId: castToUuid(input.revisionId),
        reason: input.reason,
        userId,
      })

      return { success: true, query: {} }
    },
    async create(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { content, title, instance } = input

      assertStringIsNotEmpty({ content, title })

      await assertUserIsAuthorized({
        userId,
        dataSources,
        message: 'You are not allowed to create pages.',
        guard: serloAuth.Uuid.create('Page')(instanceToScope(instance)),
      })

      const pagePayload = await dataSources.model.serlo.createPage({
        ...input,
        userId,
      })

      return {
        record: pagePayload,
        success: pagePayload !== null,
        query: {},
      }
    },
  },
  PageQuery: {
    async pages(_parent, payload, { dataSources }) {
      const { pages } = await dataSources.model.serlo.getPages({
        instance: payload.instance,
      })
      return await Promise.all(
        pages.map(async (id: number) => {
          return await dataSources.model.serlo.getUuidWithCustomDecoder({
            id: id,
            decoder: PageDecoder,
          })
        }),
      )
    },
  },
}
