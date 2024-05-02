import { createNotificationEventResolvers } from '../utils'
import { TaxonomyTermDecoder } from '~/model/decoder'
import { UuidResolver } from '~/schema/uuid/abstract-uuid/resolvers'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  SetTaxonomyParentNotificationEvent: {
    ...createNotificationEventResolvers(),
    async previousParent(event, _args, context) {
      const id = event.previousParentId
      if (id === null) return null

      return UuidResolver.resolveWithDecoder(
        TaxonomyTermDecoder,
        { id },
        context,
      )
    },
    async parent(event, _args, context) {
      const id = event.parentId
      if (id === null) return null

      return UuidResolver.resolveWithDecoder(
        TaxonomyTermDecoder,
        { id },
        context,
      )
    },
    async child(event, _args, context) {
      const id = event.childId
      return UuidResolver.resolveWithDecoder(
        TaxonomyTermDecoder,
        { id },
        context,
      )
    },
  },
}
