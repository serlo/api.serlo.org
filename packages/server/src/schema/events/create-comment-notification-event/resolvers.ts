import { createNotificationEventResolvers } from '../utils'
import { CommentDecoder } from '~/model/decoder'
import { resolveThread } from '~/schema/thread/utils'
import { UuidResolver } from '~/schema/uuid/abstract-uuid/resolvers'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  CreateCommentNotificationEvent: {
    ...createNotificationEventResolvers(),
    thread(event, _args, context) {
      return resolveThread(event.threadId, context)
    },
    async comment(event, _args, context) {
      return await UuidResolver.resolveWithDecoder(
        CommentDecoder,
        { id: event.commentId },
        context,
      )
    },
  },
}
