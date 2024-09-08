import { UuidResolver } from '../abstract-uuid/resolvers'
import { createNamespace } from '~/internals/graphql'
import { PageDecoder, PageRevisionDecoder } from '~/model/decoder'
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
  Page: {
    ...createRepositoryResolvers({ revisionDecoder: PageRevisionDecoder }),
    ...createTaxonomyTermChildResolvers(),
  },
  PageRevision: createRevisionResolvers({ repositoryDecoder: PageDecoder }),
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
