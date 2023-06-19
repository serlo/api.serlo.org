import { createNotificationEventResolvers } from '../utils'
import { TypeResolvers } from '~/internals/graphql'
import { TaxonomyTermDecoder } from '~/model/decoder'
import { SetTaxonomyParentNotificationEvent } from '~/types'

export const resolvers: TypeResolvers<SetTaxonomyParentNotificationEvent> = {
  SetTaxonomyParentNotificationEvent: {
    ...createNotificationEventResolvers(),
    async previousParent(notificationEvent, _args, { dataSources }) {
      if (notificationEvent.previousParentId === null) return null

      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.previousParentId,
        decoder: TaxonomyTermDecoder,
      })
    },
    async parent(notificationEvent, _args, { dataSources }) {
      if (notificationEvent.parentId === null) return null

      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.parentId,
        decoder: TaxonomyTermDecoder,
      })
    },
    async child(notificationEvent, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.childId,
        decoder: TaxonomyTermDecoder,
      })
    },
  },
}
