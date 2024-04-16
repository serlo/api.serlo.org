import { createNotificationEventResolvers } from '../utils'
import { TaxonomyTermDecoder } from '~/model/decoder'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  SetTaxonomyTermNotificationEvent: {
    ...createNotificationEventResolvers(),
    async taxonomyTerm(notificationEvent, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.taxonomyTermId,
        decoder: TaxonomyTermDecoder,
      })
    },
  },
}
