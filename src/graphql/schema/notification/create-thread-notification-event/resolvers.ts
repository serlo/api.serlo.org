import { requestsOnlyFields } from '../../utils'
import { UuidPayload } from '../../uuid/abstract-uuid'
import { UserPayload } from '../../uuid/user'
import { CreateThreadNotificationEventResolvers } from './types'

export const resolvers: CreateThreadNotificationEventResolvers = {
  CreateThreadNotificationEvent: {
    async author(notificationEvent, _args, { dataSources }, info) {
      const partialUser = { id: notificationEvent.authorId }
      if (requestsOnlyFields('User', ['id'], info)) {
        return partialUser
      }
      return dataSources.serlo.getUuid<UserPayload>(partialUser)
    },
    async object(notificationEvent, _args, { dataSources }) {
      return dataSources.serlo.getUuid<UuidPayload>({
        id: notificationEvent.objectId,
      })
    },
    thread(notificationEvent) {
      return Promise.resolve({ id: notificationEvent.threadId })
    },
  },
}
