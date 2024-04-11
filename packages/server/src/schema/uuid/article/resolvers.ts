import { TypeResolvers } from '~/internals/graphql'
import { ArticleDecoder, ArticleRevisionDecoder } from '~/model/decoder'
import {
  createEntityResolvers,
  createEntityRevisionResolvers,
} from '~/schema/uuid/abstract-entity/utils'
import { createTaxonomyTermChildResolvers } from '~/schema/uuid/abstract-taxonomy-term-child/utils'
import { Article, ArticleRevision } from '~/types'

export const resolvers: TypeResolvers<Article> &
  TypeResolvers<ArticleRevision> = {
  Article: {
    ...createEntityResolvers({ revisionDecoder: ArticleRevisionDecoder }),
    ...createTaxonomyTermChildResolvers(),
  },
  ArticleRevision: createEntityRevisionResolvers({
    repositoryDecoder: ArticleDecoder,
  }),
}
