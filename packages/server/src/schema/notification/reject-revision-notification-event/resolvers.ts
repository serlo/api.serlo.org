import { createNotificationEventResolvers } from '../utils'
import { RepositoryDecoder, RevisionDecoder } from '~/model/decoder'
import { UuidResolver } from '~/schema/uuid/abstract-uuid/resolvers'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  RejectRevisionNotificationEvent: {
    ...createNotificationEventResolvers(),
    async repository(event, _args, context) {
      const id = event.repositoryId
      return UuidResolver.resolveWithDecoder(RepositoryDecoder, { id }, context)
    },
    async revision(event, _args, context) {
      const id = event.repositoryId
      return UuidResolver.resolveWithDecoder(RevisionDecoder, { id }, context)
    },
  },
}
