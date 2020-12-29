import { InstanceResolvers } from '~/schema/instance/types'

export const resolvers: InstanceResolvers = {
  InstanceAware: {
    __resolveType(object) {
      return object.__typename
    },
  },
}
