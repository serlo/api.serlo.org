import { createNotificationEventResolvers } from '../utils'
import { UuidDecoder } from '~/model/decoder'
import { UuidResolver } from '~/schema/uuid/abstract-uuid/resolvers'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  SetUuidStateNotificationEvent: {
    ...createNotificationEventResolvers(),
    async object(event, _args, context) {
      const id = event.objectId
      return UuidResolver.resolveWithDecoder(UuidDecoder, { id }, context)
    },
  },
}
