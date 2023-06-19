import { createNotificationEventResolvers } from '../utils'
import { TypeResolvers } from '~/internals/graphql'
import { TaxonomyTermDecoder } from '~/model/decoder'
import { CreateTaxonomyTermNotificationEvent } from '~/types'

export const resolvers: TypeResolvers<CreateTaxonomyTermNotificationEvent> = {
  CreateTaxonomyTermNotificationEvent: {
    ...createNotificationEventResolvers(),
    async taxonomyTerm(notificationEvent, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.taxonomyTermId,
        decoder: TaxonomyTermDecoder,
      })
    },
  },
}
