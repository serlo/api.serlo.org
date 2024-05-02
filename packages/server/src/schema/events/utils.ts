import * as R from 'ramda'

import { UuidResolver } from '../uuid/abstract-uuid/resolvers'
import { NotificationEventType, UserDecoder } from '~/model/decoder'
import { AbstractNotificationEventResolvers } from '~/types'

const validTypes = Object.values(NotificationEventType)

export function isSupportedEvent(payload: unknown) {
  return (
    R.has('__typename', payload) && R.includes(payload.__typename, validTypes)
  )
}

export function createNotificationEventResolvers(): Pick<
  AbstractNotificationEventResolvers,
  'actor'
> {
  return {
    async actor(event, _args, context) {
      return await UuidResolver.resolveWithDecoder(
        UserDecoder,
        { id: event.actorId },
        context,
      )
    },
  }
}
