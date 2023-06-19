import { createNotificationEventResolvers } from '../utils'
import { TypeResolvers } from '~/internals/graphql'
import { TaxonomyTermDecoder, UuidDecoder } from '~/model/decoder'
import { RemoveTaxonomyLinkNotificationEvent } from '~/types'

export const resolvers: TypeResolvers<RemoveTaxonomyLinkNotificationEvent> = {
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
