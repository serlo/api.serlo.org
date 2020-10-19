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
      return dataSources.serlo.getUuid<UserPayload>({ id: comment.authorId })
    },
  },
}
