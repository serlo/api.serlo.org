import { ForbiddenError } from '~/errors'
import { createNamespace, Mutations } from '~/internals/graphql'

const allowedUserIds = [
  26217, // kulla
  15473, // inyono
  131536, // dal
  32543, // botho
  178145, // CarolinJaser
  178807, // HugoBT
  245844, // MoeHome
]

export const resolvers: Mutations<'_cache'> = {
  Mutation: {
    _cache: createNamespace(),
  },
  _cacheMutation: {
    async remove(_parent, { input }, { dataSources, userId }) {
      if (
        process.env.ENVIRONMENT !== 'local' &&
        (userId === null || !allowedUserIds.includes(userId))
      ) {
        throw new ForbiddenError(
          `You do not have the permissions to remove the cache`,
        )
      }

      await dataSources.model.removeCacheValue({ keys: input.keys })
      return { success: true, query: {} }
    },
  },
}
