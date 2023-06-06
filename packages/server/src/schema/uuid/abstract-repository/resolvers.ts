import { InterfaceResolvers } from '~/internals/graphql'

export const resolvers: InterfaceResolvers<'AbstractRepository'> &
  InterfaceResolvers<'AbstractRevision'> = {
  AbstractRepository: {
    __resolveType(repository) {
      return repository.__typename
    },
  },
  AbstractRevision: {
    __resolveType(revision) {
      return revision.__typename
    },
  },
}
