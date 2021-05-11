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
import * as Sentry from '@sentry/node'
import type { ApolloServerPlugin } from 'apollo-server-plugin-base'
import R from 'ramda'

import { InvalidValueFromListener } from './data-source'
import { InvalidCurrentValueError } from './data-source-helper'

export function initializeSentry({
  dsn = process.env.SENTRY_DSN,
  environment = process.env.ENVIRONMENT,
  context,
}: {
  context: string
  dsn?: string
  environment?: string
}) {
  Sentry.init({
    dsn,
    environment,
    release: `api.serlo.org-${context}@${process.env.SENTRY_RELEASE || ''}`,
  })

  Sentry.addGlobalEventProcessor((event) => {
    if (event.contexts) {
      event.contexts = stringifyContexts(event.contexts)
    }

    return event
  })
}

// See https://www.apollographql.com/docs/apollo-server/data/errors/
const ignoredErrorCodes = [
  'GRAPHQL_PARSE_FAILED',
  'GRAPHQL_VALIDATION_FAILED',
  'BAD_USER_INPUT',
  'UNAUTHENTICATED',
  'FORBIDDEN',
]

export function createSentryPlugin(): ApolloServerPlugin {
  return {
    requestDidStart() {
      return {
        didEncounterErrors(ctx) {
          if (!ctx.operation) return

          for (const error of ctx.errors) {
            if (ignoredErrorCodes.includes(error.extensions?.code)) continue

            Sentry.captureException(error, (scope) => {
              scope.setTag('kind', ctx.operationName)

              const { query, variables } = ctx.request
              scope.setContext('graphql', {
                query,
                ...(variables === undefined ? {} : { variables }),
              })

              if (error.path) {
                scope.addBreadcrumb({
                  category: 'query-path',
                  message: error.path.join(' > '),
                  level: Sentry.Severity.Debug,
                })
              }

              const { originalError } = error

              if (originalError !== undefined) {
                if (originalError instanceof InvalidCurrentValueError) {
                  const { errorContext } = originalError

                  scope.setFingerprint([
                    'invalid-value',
                    'data-source',
                    JSON.stringify(errorContext.invalidCurrentValue),
                  ])
                  scope.setContext('error', errorContext)
                }

                if (originalError instanceof InvalidValueFromListener) {
                  scope.setFingerprint([
                    'invalid-value',
                    'listener',
                    originalError.errorContext.key,
                  ])
                  scope.setContext('error', originalError.errorContext)
                }
              }

              return scope
            })
          }
        },
      }
    },
  }
}

function stringifyContexts(contexts: Record<string, Record<string, unknown>>) {
  return R.mapObjIndexed(R.mapObjIndexed(stringifyContextValue), contexts)
}

function stringifyContextValue(value: unknown) {
  return Array.isArray(value)
    ? R.map(stringify, value)
    : typeof value === 'object' && value !== null
    ? R.mapObjIndexed(stringify, value)
    : value
}

function stringify(value: unknown) {
  return typeof value === 'object' || typeof value === 'string'
    ? JSON.stringify(value, null, 2)
    : value
}

export { Sentry }
