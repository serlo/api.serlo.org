import { Event } from '@sentry/node'

import type { MockTimer } from './setup'
import type { MockKratos } from '../__tests__/__utils__/services'
import type { Cache } from '~/internals/cache'

export {}

declare global {
  /* eslint-disable no-var */
  var cache: Cache
  var server: ReturnType<typeof import('msw/node').setupServer>
  var timer: MockTimer
  var sentryEvents: Event[]
  var kratos: MockKratos
}
