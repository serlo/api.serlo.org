import { createNotificationEventResolvers } from '../utils'
import { TaxonomyTermDecoder, UuidDecoder } from '~/model/decoder'
import { UuidResolver } from '~/schema/uuid/abstract-uuid/resolvers'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  RemoveTaxonomyLinkNotificationEvent: {
    ...createNotificationEventResolvers(),
    parent(event, _args, context) {
      const id = event.parentId
      return UuidResolver.resolveWithDecoder(
        TaxonomyTermDecoder,
        { id },
        context,
      )
    },
    async child(event, _args, context) {
      const id = event.childId
      return UuidResolver.resolveWithDecoder(UuidDecoder, { id }, context)
    },
  },
}
