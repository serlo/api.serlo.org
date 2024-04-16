import { createNotificationEventResolvers } from '../utils'
import { RepositoryDecoder, RevisionDecoder } from '~/model/decoder'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  CreateEntityRevisionNotificationEvent: {
    ...createNotificationEventResolvers(),
    async entity(notificationEvent, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.entityId,
        decoder: RepositoryDecoder,
      })
    },
    async entityRevision(notificationEvent, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.entityRevisionId,
        decoder: RevisionDecoder,
      })
    },
  },
}
