import { ForbiddenError } from 'apollo-server'

import { requestsOnlyFields } from '../utils'
import { UserPayload, UuidPreResolver } from '../uuid'
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
  Thread: {
    async object(thread, _args, { dataSources }) {
      return dataSources.serlo.getUuid<UuidPreResolver>({ id: thread.objectId })
    },
    comments(thread, _args) {
      // TODO: handle connection
      return Promise.resolve({
        totalCount: thread.comments.length,
        nodes: thread.comments,
      })
    },
  },
  Mutation: {
    async createThread(_parent, payload, { dataSources, user }) {
      if (user === null) {
        throw new ForbiddenError(
          'You do not have the permissions to create a thread'
        )
      }
      return dataSources.serlo.createThread({ ...payload, userId: user })
    },
  },
}
