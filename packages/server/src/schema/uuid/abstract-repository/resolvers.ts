import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
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
