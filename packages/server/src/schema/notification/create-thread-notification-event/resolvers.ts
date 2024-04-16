import { createNotificationEventResolvers } from '../utils'
import { UuidDecoder } from '~/model/decoder'
import { resolveThread } from '~/schema/thread/utils'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  CreateThreadNotificationEvent: {
    ...createNotificationEventResolvers(),
    async object(notificationEvent, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.objectId,
        decoder: UuidDecoder,
      })
    },
    thread(notificationEvent, _args, { dataSources }) {
      return resolveThread(notificationEvent.threadId, dataSources)
    },
  },
}
