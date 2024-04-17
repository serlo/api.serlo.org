import { option as O } from 'fp-ts'
import * as t from 'io-ts'

import { InvalidCurrentValueError } from './internals/data-source-helper/common'
import { Context } from '~/context'
import { Time, timeToSeconds } from '~/timer'

export function createCachedResolver<P, R>(
  spec: ResolverSpec<P, R>,
): CachedResolver<P, R> {
  const { maxAge } = spec
  const ttlInSeconds = maxAge ? timeToSeconds(maxAge) : undefined

  return {
    __typename: 'CachedResolver',
    async resolveWithDecoder(customDecoder, payload, context) {
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
      const value = await spec.getCurrentValue(payload, context)

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
    async resolve(payload, context) {
      return this.resolveWithDecoder(spec.decoder, payload, context)
    },
    async removeCache(payload, { cache }) {
      await cache.remove({ key: spec.getKey(payload) })
    },
    spec,
  }
}

interface ResolverSpec<Payload, Result> {
  decoder: t.Type<Result, unknown>
  getKey: (payload: Payload) => string
  getPayload: (key: string) => O.Option<Payload>
  getCurrentValue: (
    args: Payload,
    context: Pick<Context, 'database'>,
  ) => Promise<unknown>
  enableSwr: boolean
  swrFrequency?: number
  staleAfter?: Time
  maxAge?: Time
  resolverNameForErrorMessage: string
}

export interface CachedResolver<Payload, Result> {
  __typename: 'CachedResolver'

  resolve(payload: Payload, context: Context): Promise<Result>

  resolveWithDecoder<S extends Result>(
    customDecoder: t.Type<S, unknown>,
    payload: Payload,
    context: Context,
  ): Promise<S>

  removeCache(payload: Payload, context: Context): Promise<void>

  spec: ResolverSpec<Payload, Result>
}
