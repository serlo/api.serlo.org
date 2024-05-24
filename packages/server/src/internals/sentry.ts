import type {
  ApolloServerPlugin,
  GraphQLRequestContextDidEncounterErrors,
} from '@apollo/server'
import * as Sentry from '@sentry/node'
import * as R from 'ramda'

import { Context } from '~/context'
import { InvalidCurrentValueError } from '~/errors'

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

  Sentry.addEventProcessor((event) => {
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
    // eslint-disable-next-line @typescript-eslint/require-await
    async requestDidStart() {
      return {
        // eslint-disable-next-line @typescript-eslint/require-await
        async didEncounterErrors(
          ctx: GraphQLRequestContextDidEncounterErrors<
            Pick<Context, 'service' | 'userId'>
          >,
        ) {
          if (!ctx.operation) return

          for (const error of ctx.errors) {
            if (ignoredErrorCodes.includes(error.extensions?.code as string)) {
              continue
            }

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
                  level: 'debug',
                })
              }

              const { originalError } = error

              if (originalError instanceof InvalidCurrentValueError) {
                const { errorContext } = originalError

                scope.setFingerprint([
                  'invalid-value',
                  'data-source',
                  JSON.stringify(errorContext.invalidCurrentValue),
                ])
                scope.setContext('error', errorContext)
              }

              return scope
            })
          }
        },
      }
    },
  }
}

function stringifyContexts(
  contexts: Record<string, Record<string, unknown> | undefined>,
) {
  return R.mapObjIndexed(R.mapObjIndexed(stringifyContextValue), contexts)
}

function stringifyContextValue(value: unknown) {
  return Array.isArray(value)
    ? R.map(stringify, value)
    : typeof value === 'object' && value !== null
      ? R.mapObjIndexed(stringify, value)
      : value === null
        ? JSON.stringify(value)
        : value
}

function stringify(value: unknown) {
  return typeof value === 'object' || typeof value === 'string'
    ? JSON.stringify(value, null, 2)
    : value
}
