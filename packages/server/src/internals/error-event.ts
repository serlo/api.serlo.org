/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
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
