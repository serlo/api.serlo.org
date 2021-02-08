/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as Sentry from '@sentry/node'
import type { ApolloServerPlugin } from 'apollo-server-plugin-base'

export function initializeSentry(context: string) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.ENVIRONMENT,
    release: `api.serlo.org-${context}@${process.env.SENTRY_RELEASE || ''}`,
  })
}

export function createSentryPlugin(): ApolloServerPlugin {
  return {
    requestDidStart() {
      return {
        didEncounterErrors(ctx) {
          if (!ctx.operation) return

          for (const error of ctx.errors) {
            Sentry.captureException(error, (scope) => {
              scope.setTag('kind', ctx.operationName)
              scope.setContext('graphql', {
                query: ctx.request.query,
                variables: ctx.request.variables,
              })

              if (error.path) {
                scope.addBreadcrumb({
                  category: 'query-path',
                  message: error.path.join(' > '),
                  level: Sentry.Severity.Debug,
                })
              }

              return scope
            })
          }
        },
      }
    },
  }
}

export { Sentry }
