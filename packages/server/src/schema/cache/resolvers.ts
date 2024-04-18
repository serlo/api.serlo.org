import { ForbiddenError } from '~/errors'
import { createNamespace } from '~/internals/graphql'
import { Resolvers } from '~/types'

const allowedUserIds = [
  26217, // kulla
  131536, // dal
  32543, // botho
  178807, // HugoBT
  245844, // MoeHome
]

export const resolvers: Resolvers = {
  Mutation: {
    _cache: createNamespace(),
  },
  _cacheMutation: {
    async remove(_parent, { input }, { cache, userId }) {
      if (
        process.env.ENVIRONMENT !== 'local' &&
        (userId === null || !allowedUserIds.includes(userId))
      ) {
        throw new ForbiddenError(
          `You do not have the permissions to remove the cache`,
        )
      }

      await Promise.all(input.keys.map((key) => cache.remove({ key })))

      return { success: true, query: {} }
    },
  },
}
