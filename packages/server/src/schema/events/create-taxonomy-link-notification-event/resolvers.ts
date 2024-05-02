import { createNotificationEventResolvers } from '../utils'
import { TaxonomyTermDecoder, UuidDecoder } from '~/model/decoder'
import { UuidResolver } from '~/schema/uuid/abstract-uuid/resolvers'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  CreateTaxonomyLinkNotificationEvent: {
    ...createNotificationEventResolvers(),
    async parent(event, _args, context) {
      return UuidResolver.resolveWithDecoder(
        TaxonomyTermDecoder,
        { id: event.parentId },
        context,
      )
    },
    async child(event, _args, context) {
      const id = event.childId
      return UuidResolver.resolveWithDecoder(UuidDecoder, { id }, context)
    },
  },
}
