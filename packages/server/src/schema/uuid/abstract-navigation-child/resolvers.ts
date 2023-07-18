import { InterfaceResolvers, TypeResolvers } from '~/internals/graphql'
import { resolveConnection } from '~/schema/connection/utils'
import { NavigationNode, Navigation } from '~/types'

export const resolvers: TypeResolvers<Navigation> &
  InterfaceResolvers<'AbstractNavigationChild'> = {
  AbstractNavigationChild: {
    __resolveType(entity) {
      return entity.__typename
    },
  },
  Navigation: {
    path(navigationChild, cursorPayload) {
      const nodesWithIndex = navigationChild.path.map((node, index) => {
        return {
          ...node,
          index: index,
        }
      })
      return Promise.resolve(
        resolveConnection<NavigationNode & { index: number }>({
          nodes: nodesWithIndex,
          payload: cursorPayload,
          createCursor(node) {
            return node.index.toString()
          },
        }),
      )
    },
  },
}
