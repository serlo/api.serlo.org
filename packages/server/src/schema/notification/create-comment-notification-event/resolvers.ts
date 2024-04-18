import { createNotificationEventResolvers } from '../utils'
import { CommentDecoder } from '~/model/decoder'
import { resolveThread } from '~/schema/thread/utils'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  CreateCommentNotificationEvent: {
    ...createNotificationEventResolvers(),
    thread(notificationEvent, _args, { dataSources }) {
      return resolveThread(notificationEvent.threadId, dataSources)
    },
    async comment(notificationEvent, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.commentId,
        decoder: CommentDecoder,
      })
    },
  },
}
