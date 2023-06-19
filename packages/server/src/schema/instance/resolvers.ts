import { InterfaceResolvers } from '~/internals/graphql'

export const resolvers: InterfaceResolvers<'InstanceAware'> = {
  InstanceAware: {
    __resolveType(object) {
      return object.__typename
    },
  },
}
