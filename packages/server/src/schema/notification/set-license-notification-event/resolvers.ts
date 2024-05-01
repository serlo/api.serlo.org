import { createNotificationEventResolvers } from '../utils'
import { RepositoryDecoder } from '~/model/decoder'
import { UuidResolver } from '~/schema/uuid/abstract-uuid/resolvers'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  SetLicenseNotificationEvent: {
    ...createNotificationEventResolvers(),
    repository(event, _args, context) {
      const id = event.repositoryId
      return UuidResolver.resolveWithDecoder(RepositoryDecoder, { id }, context)
    },
  },
}
