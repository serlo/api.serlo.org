import { createNotificationEventResolvers } from '../utils'
import { RepositoryDecoder, RevisionDecoder } from '~/model/decoder'
import { UuidResolver } from '~/schema/uuid/abstract-uuid/resolvers'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  CheckoutRevisionNotificationEvent: {
    ...createNotificationEventResolvers(),
    async repository(notificationEvent, _args, context) {
      return await UuidResolver.resolveWithDecoder(
        RepositoryDecoder,
        { id: notificationEvent.repositoryId },
        context,
      )
    },
    async revision(notificationEvent, _args, context) {
      return await UuidResolver.resolveWithDecoder(
        RevisionDecoder,
        { id: notificationEvent.revisionId },
        context,
      )
    },
  },
}
