import { createNotificationEventResolvers } from '../utils'
import { UuidDecoder } from '~/model/decoder'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  SetUuidStateNotificationEvent: {
    ...createNotificationEventResolvers(),
    async object(notificationEvent, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.objectId,
        decoder: UuidDecoder,
      })
    },
  },
}
