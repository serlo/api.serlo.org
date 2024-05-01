import { createNotificationEventResolvers } from '../utils'
import { UuidDecoder } from '~/model/decoder'
import { resolveThread } from '~/schema/thread/utils'
import { UuidResolver } from '~/schema/uuid/abstract-uuid/resolvers'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  CreateThreadNotificationEvent: {
    ...createNotificationEventResolvers(),
    async object(event, _args, context) {
      const id = event.objectId
      return UuidResolver.resolveWithDecoder(UuidDecoder, { id }, context)
    },
    thread(event, _args, context) {
      return resolveThread(event.threadId, context)
    },
  },
}
