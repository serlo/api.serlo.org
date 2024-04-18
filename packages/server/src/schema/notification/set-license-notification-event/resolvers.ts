import { createNotificationEventResolvers } from '../utils'
import { RepositoryDecoder } from '~/model/decoder'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  SetLicenseNotificationEvent: {
    ...createNotificationEventResolvers(),
    async repository(notificationEvent, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.repositoryId,
        decoder: RepositoryDecoder,
      })
    },
  },
}
