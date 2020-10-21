import { ForbiddenError } from 'apollo-server'

import { createUuidResolvers } from '../abstract-uuid'
import { UserPayload } from '../user'
import { CommentResolvers } from './types'

export const resolvers: CommentResolvers = {
  Comment: {
    ...createUuidResolvers(),
    createdAt(comment) {
      return comment.date.toString()
    },
    async author(comment, _args, { dataSources }) {
      const author = dataSources.serlo.getUuid<UserPayload>({
        id: comment.authorId,
      })
      if (author === null) {
        throw new ForbiddenError('There is no author with this id')
      }
      return author
    },
  },
}
