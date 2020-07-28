import { requestsOnlyFields } from '../../utils'
import { EntityPayload } from '../../uuid/abstract-entity'
import { UserPayload } from '../../uuid/user'
import { CreateEntityNotificationEventResolvers } from './types'

export const resolvers: CreateEntityNotificationEventResolvers = {
  CreateEntityNotificationEvent: {
    async author(notificationEvent, _args, { dataSources }, info) {
      const partialUser = { id: notificationEvent.authorId }
      if (requestsOnlyFields('User', ['id'], info)) {
        return partialUser
      }
      return dataSources.serlo.getUuid<UserPayload>(partialUser)
    },
    async entity(notificationEvent, _args, { dataSources }) {
      return dataSources.serlo.getUuid<EntityPayload>({
        id: notificationEvent.entityId,
      })
    },
  },
}
