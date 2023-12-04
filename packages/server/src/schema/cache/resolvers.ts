import { ForbiddenError } from '~/errors'
import { Service } from '~/internals/authentication'
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
    async remove(_parent, { input }, { dataSources, service, userId }) {
      checkPermission({
        service,
        userId,
        operation: 'remove',
        allowedServices: [Service.Serlo],
      })

      await dataSources.model.removeCacheValue({ keys: input.keys })
      return { success: true, query: {} }
    },
  },
}

function checkPermission({
  service,
  allowedServices,
  userId,
  operation,
}: {
  service: Service
  allowedServices: Service[]
  userId: number | null
  operation: string
}) {
  if (
    process.env.ENVIRONMENT !== 'local' &&
    !allowedServices.includes(service) &&
    (userId === null || !allowedUserIds.includes(userId))
  ) {
    throw new ForbiddenError(
      `You do not have the permissions to ${operation} the cache`,
    )
  }
}
