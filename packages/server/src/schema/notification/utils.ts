import * as R from 'ramda'

import { NotificationEventType, UserDecoder } from '~/model/decoder'
import { AbstractNotificationEventResolvers } from '~/types'

const validTypes = Object.values(NotificationEventType)

export function isSupportedNotificationEvent(payload: unknown) {
  return (
    R.has('__typename', payload) && R.includes(payload.__typename, validTypes)
  )
}

export function createNotificationEventResolvers(): Pick<
  AbstractNotificationEventResolvers,
  'actor'
> {
  return {
    async actor(notificationEvent, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: notificationEvent.actorId,
        decoder: UserDecoder,
      })
    },
  }
}
