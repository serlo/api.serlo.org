import {
  createEntityResolvers,
  createEntityRevisionResolvers,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { createTaxonomyTermChildResolvers } from '../abstract-taxonomy-term-child'
import { ArticlePreResolver, ArticleRevisionPreResolver } from './types'

export const resolvers = {
  Article: {
    ...createEntityResolvers<ArticlePreResolver, ArticleRevisionPreResolver>({
      entityRevisionType: EntityRevisionType.ArticleRevision,
    }),
    ...createTaxonomyTermChildResolvers<ArticlePreResolver>(),
  },
  ArticleRevision: createEntityRevisionResolvers<
    ArticlePreResolver,
    ArticleRevisionPreResolver
  >({
    entityType: EntityType.Article,
    repository: 'article',
  }),
}
