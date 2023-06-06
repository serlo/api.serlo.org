import { createNotificationEventResolvers } from '../utils'
import { TypeResolvers } from '~/internals/graphql'
import { RepositoryDecoder, RevisionDecoder } from '~/model/decoder'
import { RejectRevisionNotificationEvent } from '~/types'

export const resolvers: TypeResolvers<RejectRevisionNotificationEvent> = {
  RejectRevisionNotificationEvent: {
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
