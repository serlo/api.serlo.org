import { requestsOnlyFields } from '../../utils'
import { UserPayload } from '../../uuid/user'
import { SetThreadStateNotificationEventResolvers } from './types'

export const resolvers: SetThreadStateNotificationEventResolvers = {
  SetThreadStateNotificationEvent: {
    async actor(notificationEvent, _args, { dataSources }, info) {
      const partialUser = { id: notificationEvent.actorId }
      if (requestsOnlyFields('User', ['id'], info)) {
        return partialUser
      }
      return dataSources.serlo.getUuid<UserPayload>(partialUser)
    },
    thread(notificationEvent) {
      return Promise.resolve({ id: notificationEvent.threadId })
    },
  },
}
