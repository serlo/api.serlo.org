import * as R from 'ramda'

import { NotificationEventType } from '~/model/decoder'

const validTypes = Object.values(NotificationEventType)

export function isSupportedEvent(payload: unknown) {
  return (
    R.has('__typename', payload) && R.includes(payload.__typename, validTypes)
  )
}
