import { InterfaceResolvers } from '~/internals/graphql'

export const resolvers: InterfaceResolvers<'AbstractTaxonomyTermChild'> = {
  AbstractTaxonomyTermChild: {
    __resolveType(entity) {
      return entity.__typename
    },
  },
}
