import { createNotificationEventResolvers } from '../utils'
import { TypeResolvers } from '~/internals/graphql'
import { CommentDecoder } from '~/model/decoder'
import { resolveThread } from '~/schema/thread/utils'
import { CreateCommentNotificationEvent } from '~/types'

export const resolvers: TypeResolvers<CreateCommentNotificationEvent> = {
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
