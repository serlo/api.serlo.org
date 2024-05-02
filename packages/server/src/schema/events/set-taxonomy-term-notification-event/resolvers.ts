import { createNotificationEventResolvers } from '../utils'
import { TaxonomyTermDecoder } from '~/model/decoder'
import { UuidResolver } from '~/schema/uuid/abstract-uuid/resolvers'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  SetTaxonomyTermNotificationEvent: {
    ...createNotificationEventResolvers(),
    taxonomyTerm(event, _args, context) {
      return UuidResolver.resolveWithDecoder(
        TaxonomyTermDecoder,
        { id: event.taxonomyTermId },
        context,
      )
    },
  },
}
