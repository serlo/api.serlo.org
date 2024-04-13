import { option as O } from 'fp-ts'
import * as t from 'io-ts'
import * as R from 'ramda'

import { InvalidCurrentValueError } from './common'
import { Context } from '../graphql'
import { Time, timeToSeconds } from '../swr-queue'

export function createCachedResolver<P, R>(
  spec: ResolverSpec<P, R>,
): CachedResolver<P, R> {
  const { maxAge } = spec
  const ttlInSeconds = maxAge ? timeToSeconds(maxAge) : undefined

  return {
    __typename: 'CachedResolver',
    async resolveWithDecoder({ payload, customDecoder, cache, swrQueue }) {
      const key = spec.getKey(payload)
      const cacheValue = await cache.get<R>({ key, maxAge })

      if (O.isSome(cacheValue)) {
        const cacheEntry = cacheValue.value

        if (customDecoder.is(cacheEntry.value)) {
          if (
            spec.swrFrequency === undefined ||
            Math.random() < spec.swrFrequency
          ) {
            await swrQueue.queue({ key, cacheEntry: cacheValue })
          }

          return cacheEntry.value
        }
      }

      // Cache empty or invalid value
      const value = await spec.getCurrentValue(payload)

      if (customDecoder.is(value)) {
        await cache.set({
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
          args.cache.remove({ key: spec.getKey(payload) }),
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
  getCurrentValue: (payload: Payload) => Promise<unknown>
  enableSwr: boolean
  swrFrequency?: number
  staleAfter?: Time
  maxAge?: Time
  resolverNameForErrorMessage: string
}

interface CachedResolver<Payload, Result> {
  __typename: 'CachedResolver'

  resolve(args: { payload: Payload } & CacheAndSwrQueueContext): Promise<Result>

  resolveWithDecoder<S extends Result>(
    args: {
      payload: Payload
      customDecoder: t.Type<S, unknown>
    } & CacheAndSwrQueueContext,
  ): Promise<S>

  removeCache(
    args: PayloadArrayOrPayload<Payload> & CacheContext,
  ): Promise<void>

  spec: ResolverSpec<Payload, Result>
}

type CacheContext = Pick<Context, 'cache'>
type CacheAndSwrQueueContext = Pick<Context, 'cache' | 'swrQueue'>

type PayloadArrayOrPayload<P> = { payload: P } | { payloads: P[] }

function toPayloadArray<P>(arg: PayloadArrayOrPayload<P>): P[] {
  return R.has('payloads', arg) ? arg.payloads : [arg.payload]
}
