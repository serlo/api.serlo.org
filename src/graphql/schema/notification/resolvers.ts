import { NotificationEventPreResolver, NotificationResolvers } from './types'

export const resolvers: NotificationResolvers = {
  AbstractNotificationEvent: {
    __resolveType(notificationEvent) {
      return notificationEvent.__typename
    },
  },
  Query: {
    async notificationEvent(_parent, payload, { dataSources }) {
      return dataSources.serlo.getNotificationEvent<
        NotificationEventPreResolver
      >(payload)
    },
  },
}
