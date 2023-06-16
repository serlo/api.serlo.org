import { createNotificationEventResolvers } from '../utils'
import { TypeResolvers } from '~/internals/graphql'
import { TaxonomyTermDecoder, UuidDecoder } from '~/model/decoder'
import { CreateTaxonomyLinkNotificationEvent } from '~/types'

export const resolvers: TypeResolvers<CreateTaxonomyLinkNotificationEvent> = {
  CreateTaxonomyLinkNotificationEvent: {
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
