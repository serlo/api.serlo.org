import { createNotificationEventResolvers } from '../utils'
import { EntityDecoder } from '~/model/decoder'
import { UuidResolver } from '~/schema/uuid/abstract-uuid/resolvers'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  CreateEntityNotificationEvent: {
    ...createNotificationEventResolvers(),
    async entity(event, _args, context) {
      const id = event.entityId
      return UuidResolver.resolveWithDecoder(EntityDecoder, { id }, context)
    },
  },
}
