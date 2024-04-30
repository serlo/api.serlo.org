import { createNotificationEventResolvers } from '../utils'
import { EntityDecoder } from '~/model/decoder'
import { UuidResolver } from '~/schema/uuid/abstract-uuid/resolvers'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  CreateEntityLinkNotificationEvent: {
    ...createNotificationEventResolvers(),
    async parent(event, _args, context) {
      const id = event.parentId
      return UuidResolver.resolveWithDecoder(EntityDecoder, { id }, context)
    },
    async child(event, _args, context) {
      const id = event.childId
      return UuidResolver.resolveWithDecoder(EntityDecoder, { id }, context)
    },
  },
}
