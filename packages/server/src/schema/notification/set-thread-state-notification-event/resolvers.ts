import { createNotificationEventResolvers } from '../utils'
import { TypeResolvers } from '~/internals/graphql'
import { resolveThread } from '~/schema/thread/utils'
import { SetThreadStateNotificationEvent } from '~/types'

export const resolvers: TypeResolvers<SetThreadStateNotificationEvent> = {
  SetThreadStateNotificationEvent: {
    ...createNotificationEventResolvers(),
    thread(notificationEvent, _args, { dataSources }) {
      return resolveThread(notificationEvent.threadId, dataSources)
    },
  },
}
