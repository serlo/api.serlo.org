import { ForbiddenError } from 'apollo-server'

import { Service } from '../types'
import { requestsOnlyFields } from '../utils'
import { UserPayload } from '../uuid'
import { ThreadsResolvers } from './types'

export const resolvers: ThreadsResolvers = {
  Comment: {
    async author(comment, _args, { dataSources }, info) {
      const partialUser = { id: comment.authorId }
      if (requestsOnlyFields('User', ['id'], info)) {
        return partialUser
      }
      return dataSources.serlo.getUuid<UserPayload>(partialUser)
    },
  },
  Mutation: {
    async createThread(_parent, payload, { dataSources, service }) {
      if (service !== Service.Serlo) {
        throw new ForbiddenError(
          'You do not have the permissions to create a thread'
        )
      }
      await dataSources.serlo.createThread(payload)
    },
  },
}
