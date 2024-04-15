import { createNotificationEventResolvers } from '../utils'
import { TaxonomyTermDecoder, UuidDecoder } from '~/model/decoder'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  RemoveTaxonomyLinkNotificationEvent: {
    ...createNotificationEventResolvers(),
    async parent(notificationEvent, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.parentId,
        decoder: TaxonomyTermDecoder,
      })
    },
    async child(notificationEvent, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.childId,
        decoder: UuidDecoder,
      })
    },
  },
}
