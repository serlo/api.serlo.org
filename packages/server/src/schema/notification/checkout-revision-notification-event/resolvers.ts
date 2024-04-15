import { createNotificationEventResolvers } from '../utils'
import { RepositoryDecoder, RevisionDecoder } from '~/model/decoder'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  CheckoutRevisionNotificationEvent: {
    ...createNotificationEventResolvers(),
    async repository(notificationEvent, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.repositoryId,
        decoder: RepositoryDecoder,
      })
    },
    async revision(notificationEvent, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.revisionId,
        decoder: RevisionDecoder,
      })
    },
  },
}
