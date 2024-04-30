import { createNotificationEventResolvers } from '../utils'
import { resolveThread } from '~/schema/thread/utils'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  SetThreadStateNotificationEvent: {
    ...createNotificationEventResolvers(),
    thread(notificationEvent, _args, context) {
      return resolveThread(notificationEvent.threadId, context)
    },
  },
}
