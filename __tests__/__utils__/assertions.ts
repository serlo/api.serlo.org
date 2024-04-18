import { ApolloServer } from '@apollo/server'
import { type Storage } from '@google-cloud/storage'
import * as Sentry from '@sentry/node'
import { DocumentNode } from 'graphql'
import * as R from 'ramda'

import { createTestEnvironment, given, nextUuid } from '.'
import { user } from '../../__fixtures__'
import { Context } from '~/context'
import { Service } from '~/context/service'
import { Database } from '~/database'
import { ModelDataSource } from '~/internals/data-source'
import { Environment } from '~/internals/environment'
import { getGraphQLOptions } from '~/internals/server'

export class Client {
  private apolloServer: ApolloServer<ClientContext>
  private readonly context?: ClientContext

  constructor(context?: ClientContext) {
    this.context = context
    this.apolloServer = new ApolloServer<
      Partial<Pick<Context, 'service' | 'userId'>>
    >(getGraphQLOptions())
  }

  prepareQuery<I extends Input = Input, V extends Variables<I> = Variables<I>>(
    query: QuerySpec<V>,
  ) {
    return new Query(this, query)
  }

  async execute(query: QuerySpec<Variables<Input>>) {
    const environment: Environment = createTestEnvironment()

    return this.apolloServer.executeOperation(query, {
      contextValue: {
        dataSources: {
          model: new ModelDataSource(environment),
        },
        service: this.context?.service ?? Service.SerloCloudflareWorker,
        userId: this.context?.userId ?? null,
        googleStorage: {
          bucket() {
            return {
              file() {
                return {
                  getSignedUrl() {
                    return ['http://google.com/upload']
                  },
                }
              },
            }
          },
        } as unknown as Storage,
        database: new Database(await this.getTransaction()),
        cache: environment.cache,
        swrQueue: environment.swrQueue,
      } as Context,
    })
  }

  private async getTransaction() {
    if (global.transaction != null) return global.transaction

    global.transaction = await global.database.getConnection()

    await global.transaction.beginTransaction()

    return global.transaction
  }
}

export class Query<
  I extends Input = Input,
  V extends Variables<I> = Variables<I>,
> {
  constructor(
    private client: Client,
    private query: QuerySpec<V>,
  ) {}

  withInput(input: I) {
    return new Query(this.client, { ...this.query, variables: { input } })
  }

  changeInput(input: Partial<I>) {
    return new Query(
      this.client,
      R.mergeDeepRight(this.query, { variables: { input } }),
    )
  }

  withVariables(variables: V) {
    return new Query(this.client, { ...this.query, variables })
  }

  withContext(context: ClientContext) {
    return new Query(new Client(context), this.query)
  }

  forLoginUser(...additionalRoles: string[]) {
    const loginUser = {
      ...user,
      id: nextUuid(user.id),
      roles: [...additionalRoles, 'login'],
    }

    given('UuidQuery').for(loginUser)

    return this.withContext({ userId: loginUser.id })
  }

  forUnauthenticatedUser() {
    return this.withContext({ userId: null })
  }

  execute() {
    return this.client.execute(this.query)
  }

  async shouldReturnData(data: unknown) {
    const result = await this.execute()

    expect(result.body.kind).toBe('single')
    if (result.body.kind === 'single') {
      expect(result.body.singleResult['errors']).toBeUndefined()
      expect(result.body.singleResult).toMatchObject({ data })
    }
  }

  async shouldFailWithError(
    expectedError:
      | 'BAD_USER_INPUT'
      | 'FORBIDDEN'
      | 'INTERNAL_SERVER_ERROR'
      | 'UNAUTHENTICATED',
  ) {
    const response = await this.execute()
    expect(response.body.kind).toBe('single')
    if (response.body.kind === 'single') {
      expect(response?.body.singleResult.errors?.[0]?.extensions?.code).toEqual(
        expectedError,
      )
    }
  }
}

type ClientContext = Partial<Pick<Context, 'service' | 'userId'>>
type Variables<I> = { input: I } | Record<string, unknown>
type Input = Record<string, unknown>
interface QuerySpec<V> {
  query: DocumentNode
  variables?: V
}

/**
 * Assertion that a certain error event occurred. Since we use Sentry this
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
  fingerprint?: string[]
  location?: string
  errorContext?: Record<string, unknown>
}) {
  const eventPredicate = (event: Sentry.Event) => {
    const exception = event.exception?.values?.[0]

    if (
      args?.message !== undefined &&
      exception?.value !== args.message &&
      event.message !== args.message
    ) {
      return false
    }

    if (args?.errorContext !== undefined) {
      for (const contextName in args.errorContext) {
        const contextValue = event.contexts?.error?.[contextName]
        const targetValue = args.errorContext[contextName]

        if (!R.equals(destringifyProperties(contextValue), targetValue))
          return false
      }
    }

    if (args?.location && event.tags?.location !== args.location) {
      return false
    }

    if (args?.fingerprint !== undefined) {
      if (!R.equals(event.fingerprint, args.fingerprint)) return false
    }

    return true
  }

  await waitForAllSentryEvents()
  expect(global.sentryEvents.some(eventPredicate)).toBe(true)
}

/**
 * Assertation that no error events have been triggert to sentry
 */
export async function assertNoErrorEvents() {
  await waitForAllSentryEvents()
  expect(global.sentryEvents.length).toBe(0)
}

function waitForAllSentryEvents() {
  return new Promise((resolve) => setTimeout(resolve, 400))
}

function destringifyProperties(value: unknown) {
  return Array.isArray(value)
    ? value.map(destringify)
    : typeof value === 'object' && value !== null
      ? R.mapObjIndexed(destringify, value)
      : value === 'null'
        ? null
        : value
}

function destringify(value: unknown) {
  return typeof value === 'string' ? (JSON.parse(value) as unknown) : value
}
