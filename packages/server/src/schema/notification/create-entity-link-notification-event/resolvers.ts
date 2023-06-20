import { createNotificationEventResolvers } from '../utils'
import { TypeResolvers } from '~/internals/graphql'
import { EntityDecoder } from '~/model/decoder'
import { CreateEntityLinkNotificationEvent } from '~/types'

export const resolvers: TypeResolvers<CreateEntityLinkNotificationEvent> = {
  CreateEntityLinkNotificationEvent: {
    ...createNotificationEventResolvers(),
    async parent(notificationEvent, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.parentId,
        decoder: EntityDecoder,
      })
    },
    async child(notificationEvent, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.childId,
        decoder: EntityDecoder,
      })
    },
  },
}
