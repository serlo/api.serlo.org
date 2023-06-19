import { createNotificationEventResolvers } from '../utils'
import { TypeResolvers } from '~/internals/graphql'
import { EntityDecoder } from '~/model/decoder'
import { CreateEntityNotificationEvent } from '~/types'

export const resolvers: TypeResolvers<CreateEntityNotificationEvent> = {
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
