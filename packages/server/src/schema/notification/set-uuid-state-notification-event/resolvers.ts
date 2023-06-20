import { createNotificationEventResolvers } from '../utils'
import { TypeResolvers } from '~/internals/graphql'
import { UuidDecoder } from '~/model/decoder'
import { SetUuidStateNotificationEvent } from '~/types'

export const resolvers: TypeResolvers<SetUuidStateNotificationEvent> = {
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
