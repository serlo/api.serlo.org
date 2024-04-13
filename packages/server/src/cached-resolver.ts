import { option as O } from 'fp-ts'
import * as t from 'io-ts'
import * as R from 'ramda'

import { InvalidCurrentValueError } from './internals/data-source-helper/common'
import { Context } from './internals/graphql'
import { Time, timeToSeconds } from './internals/swr-queue'

export function createCachedResolver<P, R>(
  spec: ResolverSpec<P, R>,
): CachedResolver<P, R> {
  const { maxAge } = spec
  const ttlInSeconds = maxAge ? timeToSeconds(maxAge) : undefined

  return {
    __typename: 'CachedResolver',
    async resolveWithDecoder({ payload, customDecoder, context }) {
      const key = spec.getKey(payload)
      const cacheValue = await context.cache.get<R>({ key, maxAge })

      if (O.isSome(cacheValue)) {
        const cacheEntry = cacheValue.value

        if (customDecoder.is(cacheEntry.value)) {
          if (
            spec.swrFrequency === undefined ||
            Math.random() < spec.swrFrequency
          ) {
            await context.swrQueue.queue({ key, cacheEntry: cacheValue })
          }

          return cacheEntry.value
        }
      }

      // Cache empty or invalid value
      const value = await spec.getCurrentValue({ ...payload, context })

      if (customDecoder.is(value)) {
        await context.cache.set({
          key,
          value,
          source: 'API: From a call to a data source',
          ttlInSeconds,
        })

        return value
      } else {
        throw new InvalidCurrentValueError({
          ...(O.isSome(cacheValue)
            ? { invalidCachedValue: cacheValue.value.value }
            : {}),
          invalidCurrentValue: value,
          decoder: customDecoder.name,
          payload,
          type: spec.resolverNameForErrorMessage,
          key,
        })
      }
    },
    async resolve(args) {
      return this.resolveWithDecoder({ ...args, customDecoder: spec.decoder })
    },
    async removeCache(args) {
      await Promise.all(
        toPayloadArray(args).map((payload) =>
          args.context.cache.remove({ key: spec.getKey(payload) }),
        ),
      )
    },
    spec,
  }
}

interface ResolverSpec<Payload, Result> {
  decoder: t.Type<Result, unknown>
  getKey: (payload: Payload) => string
  getPayload: (key: string) => O.Option<Payload>
  getCurrentValue: (args: Payload & ContextArgument) => Promise<unknown>
  enableSwr: boolean
  swrFrequency?: number
  staleAfter?: Time
  maxAge?: Time
  resolverNameForErrorMessage: string
}

export interface CachedResolver<Payload, Result> {
  __typename: 'CachedResolver'

  resolve(args: { payload: Payload } & ContextArgument): Promise<Result>

  resolveWithDecoder<S extends Result>(
    args: {
      payload: Payload
      customDecoder: t.Type<S, unknown>
    } & ContextArgument,
  ): Promise<S>

  removeCache(
    args: PayloadArrayOrPayload<Payload> & ContextArgument,
  ): Promise<void>

  spec: ResolverSpec<Payload, Result>
}

type PayloadArrayOrPayload<P> = { payload: P } | { payloads: P[] }
interface ContextArgument {
  context: Context
}

function toPayloadArray<P>(arg: PayloadArrayOrPayload<P>): P[] {
  return R.has('payloads', arg) ? arg.payloads : [arg.payload]
}
