import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  AbstractTaxonomyTermChild: {
    __resolveType(entity) {
      return entity.__typename
    },
  },
}
