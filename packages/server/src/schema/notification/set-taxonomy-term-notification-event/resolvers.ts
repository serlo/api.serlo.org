import { createNotificationEventResolvers } from '../utils'
import { TypeResolvers } from '~/internals/graphql'
import { TaxonomyTermDecoder } from '~/model/decoder'
import { SetTaxonomyTermNotificationEvent } from '~/types'

export const resolvers: TypeResolvers<SetTaxonomyTermNotificationEvent> = {
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
