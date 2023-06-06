import { createNotificationEventResolvers } from '../utils'
import { TypeResolvers } from '~/internals/graphql'
import { RepositoryDecoder } from '~/model/decoder'
import { SetLicenseNotificationEvent } from '~/types'

export const resolvers: TypeResolvers<SetLicenseNotificationEvent> = {
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
