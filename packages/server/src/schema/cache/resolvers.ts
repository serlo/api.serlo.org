import { GraphQLError } from 'graphql'

import { Service } from '~/internals/authentication'
import { createNamespace, Mutations } from '~/internals/graphql'

const allowedUserIds = [
  26217, // kulla
  15473, // inyono
  131536, // dal
  32543, // botho
  178145, // CarolinJaser
  178807, // HugoBT
]

export const resolvers: Mutations<'_cache'> = {
  Mutation: {
    _cache: createNamespace(),
  },
  _cacheMutation: {
    async set(_parent, payload, { dataSources, service, userId }) {
      const { key, value } = payload.input
      checkPermission({
        service,
        userId,
        operation: 'set',
        allowedServices: [Service.Serlo],
      })
      await dataSources.model.setCacheValue({ key, value })
      return { success: true, query: {} }
    },
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
    async update(_parent, { input }, { dataSources, service, userId }) {
      checkPermission({
        service,
        userId,
        operation: 'update',
        allowedServices: [Service.Serlo, Service.SerloCacheWorker],
      })
      await Promise.all(
        input.keys.map((key) => dataSources.model.updateCacheValue({ key })),
      )
      return { success: true }
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
    throw new GraphQLError(
      `You do not have the permissions to ${operation} the cache`,
      { extensions: { code: 'FORBIDDEN' } },
    )
  }
}
