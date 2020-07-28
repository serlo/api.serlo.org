import { requestsOnlyFields } from '../../utils'
import { UserPayload } from '../../uuid/user'
import { CreateCommentNotificationEventResolvers } from './types'

export const resolvers: CreateCommentNotificationEventResolvers = {
  CreateCommentNotificationEvent: {
    async author(notificationEvent, _args, { dataSources }, info) {
      const partialUser = { id: notificationEvent.authorId }
      if (requestsOnlyFields('User', ['id'], info)) {
        return partialUser
      }
      return dataSources.serlo.getUuid<UserPayload>(partialUser)
    },
    thread(notificationEvent) {
      return Promise.resolve({ id: notificationEvent.threadId })
    },
    comment(notificationEvent) {
      return Promise.resolve({ id: notificationEvent.commentId })
    },
  },
}
