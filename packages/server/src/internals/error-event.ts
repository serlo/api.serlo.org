import { array as A } from 'fp-ts'
import * as F from 'fp-ts/lib/function'
import R from 'ramda'

import { Sentry } from '~/internals/sentry'

export interface ErrorEvent extends ErrorContext {
  error: Error
}

export function addContext(
  context: ErrorContext
): (error: ErrorEvent) => ErrorEvent {
  return R.mergeDeepWith(
    (a: unknown, b: unknown) =>
      Array.isArray(a) && Array.isArray(b) ? R.concat(a, b) : a,
    context
  )
}

export function consumeErrorEvent<A>(defaultValue: A) {
  return (event: ErrorEvent) => {
    captureErrorEvent(event)

    return defaultValue
  }
}

export function assertAll<A, B extends A>(
  args: { assertion: F.Refinement<A, B> } & ErrorEvent
): (list: A[]) => B[]
export function assertAll<A>(
  args: { assertion: F.Predicate<A> } & ErrorEvent
): (list: A[]) => A[]
export function assertAll(
  args: { assertion: (x: unknown) => boolean } & ErrorEvent
) {
  return (originalList: unknown[]) => {
    const { left, right } = A.partition(args.assertion)(originalList)

    if (left.length > 0) {
      const errorEvent = addContext({
        errorContext: {
          originalList,
          invalidElements: left,
        },
      })(args)

      captureErrorEvent(errorEvent)
    }

    return right
  }
}

export function captureErrorEvent(event: ErrorEvent) {
  Sentry.captureException(event.error, (scope) => {
    if (event.location) {
      if (!event.error.message.startsWith(event.location)) {
        event.error.message = `${event.location}: ${event.error.message}`
      }

      scope.setTag('location', event.location)
    }

    if (event.locationContext) {
      scope.setContext('location', event.locationContext)
    }

    if (event.errorContext) {
      scope.setContext('error', event.errorContext)
    }

    if (event.fingerprint) {
      scope.setFingerprint(event.fingerprint)
    }

    scope.setLevel('error')

    return scope
  })
}

export interface ErrorContext {
  location?: string
  fingerprint?: string[]
  locationContext?: Record<string, unknown>
  errorContext?: Record<string, unknown>
}
