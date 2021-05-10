/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { GraphQLResponse } from 'apollo-server-types'
import { DocumentNode } from 'graphql'
import R from 'ramda'

import { Client } from './test-client'
import { Sentry } from '~/internals/sentry'

export async function assertSuccessfulGraphQLQuery({
  query,
  variables,
  data,
  client,
}: {
  query: string | DocumentNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: Record<string, any>
  data: GraphQLResponse['data']
  client: Client
}) {
  const response = await client.query({
    query,
    variables,
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual(data)
}

export async function assertFailingGraphQLQuery({
  query,
  variables,
  client,
  message,
}: {
  query: string | DocumentNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: Record<string, any>
  client: Client
  message?: unknown
}) {
  const response = await client.query({
    query,
    variables,
  })
  expect(response.errors).toBeDefined()

  if (message)
    expect(response.errors?.map((error) => error.message)).toContainEqual(
      message
    )
}

export async function assertSuccessfulGraphQLMutation({
  mutation,
  variables,
  data,
  client,
}: {
  mutation: DocumentNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: Record<string, any>
  data?: GraphQLResponse['data']
  client: Client
}) {
  const response = await client.mutate({
    mutation,
    variables,
  })
  expect(response.errors).toBeUndefined()
  if (data !== undefined) expect(response.data).toEqual(data)
}

export async function assertFailingGraphQLMutation({
  mutation,
  variables,
  client,
  expectedError,
}: {
  mutation: DocumentNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: Record<string, any>
  client: Client
  expectedError: string
}) {
  const response = await client.mutate({
    mutation,
    variables,
  })
  expect(response?.errors?.[0]?.extensions?.code).toEqual(expectedError)
}

/**
 * Assertion that a certain error event occured. Since we use Sentry this
 * function checks that a Sentry event was thrown.
 *
 * TODO: This function has not a good error message in case the assertion
 * fails. I recommend you to investigate `global.sentryEvents` with
 * `console.log()` or something similar when your tests fail.
 *
 * @example
 * ```ts
 * // assertion that at least one error occurred
 * assertErrorEvent()
 * ```
 *
 * @example
 * ```ts
 * assertErrorEvent({
 *   // additional assertion that error message is 'Error XYZ'
 *   message: 'Error XYZ'
 * })
 * ```
 *
 * @example
 * ```ts
 * assertErrorEvent({
 *   // additional assertion that the context "error" contains
 *   // `{ invalidValue: 23 }`. This means that `contexts.error.invalidValue === 23`.
 *   // See https://docs.sentry.io/platforms/javascript/enriching-events/context/
 *   // for an introduction about contexts in Sentry
 *   errorContext: { invalidValue: 23 },
 * })
 * ```
 */
export async function assertErrorEvent(args?: {
  message?: string
  errorContext?: Record<string, unknown>
}) {
  const eventPredicate = (event: Sentry.Event) => {
    const exception = event.exception?.values?.[0]

    if (args?.message !== undefined && exception?.value !== args.message)
      return false

    if (args?.errorContext !== undefined) {
      for (const contextName in args.errorContext) {
        const contextValue = event.contexts?.error?.[contextName]
        const targetValue = args.errorContext[contextName]

        if (!R.equals(destringifyProperties(contextValue), targetValue))
          return false
      }
    }

    return true
  }
  const waitForAllSentryEvents = new Promise((resolve) =>
    setTimeout(resolve, 400)
  )

  await waitForAllSentryEvents
  expect(global.sentryEvents.some(eventPredicate)).toBe(true)
}

function destringifyProperties(value: unknown) {
  const destringify = (value: unknown) =>
    typeof value === 'string' ? (JSON.parse(value) as unknown) : value

  return Array.isArray(value)
    ? value.map(destringify)
    : typeof value === 'object' && value !== null
    ? R.mapObjIndexed(destringify, value)
    : value
}
