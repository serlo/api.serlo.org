import { createNotificationEventResolvers } from '../utils'
import { TypeResolvers } from '~/internals/graphql'
import { RepositoryDecoder, RevisionDecoder } from '~/model/decoder'
import { CreateEntityRevisionNotificationEvent } from '~/types'

export const resolvers: TypeResolvers<CreateEntityRevisionNotificationEvent> = {
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
