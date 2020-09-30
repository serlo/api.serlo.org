import * as R from 'ramda'

import { resolveConnection } from '../connection'
import { UuidPayload } from '../uuid'
import { CommentPayload } from '../uuid/comment/types'
import { ThreadResolvers } from './types'

export const resolvers: ThreadResolvers = {
  Thread: {
    async object(thread, _args, { dataSources }) {
      return dataSources.serlo.getUuid<UuidPayload>({ id: thread.objectId })
    },
    comments(thread, cursorPayload) {
      return resolveConnection<CommentPayload>({
        nodes: thread.comments,
        payload: cursorPayload,
        createCursor(node) {
          return node.id.toString()
        },
      })
    },
    createdAt(thread, _args) {
      return thread.comments
        .map((comment) => comment.date)
        .reduce(R.min)
        .toString()
    },
    updatedAt(thread, _args) {
      return thread.comments
        .map((comment) => comment.date)
        .reduce(R.max)
        .toString()
    },
    title(thread, _args) {
      return thread.comments[0].title
    },
    // TODO: Mutation ergänzen
    /*
    Mutation: {
      async createThread(_parent, payload, { dataSources, user }) {
        if (user === null) {
          throw new ForbiddenError(
            'You do not have the permissions to create a thread'
          )
        }
        return dataSources.serlo.createThread({ ...payload, userId: user })
      },
    },*/
  },
}
