import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  InstanceAware: {
    __resolveType(object) {
      return object.__typename
    },
  },
}
