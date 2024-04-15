import { createNotificationEventResolvers } from '../utils'
import { EntityDecoder } from '~/model/decoder'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  CreateEntityNotificationEvent: {
    ...createNotificationEventResolvers(),
    async entity(notificationEvent, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.entityId,
        decoder: EntityDecoder,
      })
    },
  },
}
