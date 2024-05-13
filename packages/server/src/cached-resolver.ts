import { option as O } from 'fp-ts'
import * as t from 'io-ts'

import { Context } from '~/context'
import { InvalidCurrentValueError } from '~/errors'
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

          if (cacheEntry.value !== null) {
            return cacheEntry.value
          }
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
          type: spec.name,
          key,
        })
      }
    },
    async resolve(payload, context) {
      return this.resolveWithDecoder(spec.decoder, payload, context)
    },
    async removeCacheEntry(payload, { cache }) {
      await cache.remove({ key: spec.getKey(payload) })
    },
    async removeCacheEntries(payloads, context) {
      await Promise.all(
        payloads.map((payload) => this.removeCacheEntry(payload, context)),
      )
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
    context: Pick<Context, 'database' | 'timer'>,
  ) => Promise<unknown>
  enableSwr: boolean
  swrFrequency?: number
  staleAfter?: Time
  maxAge?: Time
  name: string
  examplePayload: Payload
}

export interface CachedResolver<Payload, Result> {
  __typename: 'CachedResolver'

  resolve(
    payload: Payload,
    context: Pick<Context, 'database' | 'cache' | 'swrQueue' | 'timer'>,
  ): Promise<Result>

  resolveWithDecoder<S extends Result>(
    customDecoder: t.Type<S, unknown>,
    payload: Payload,
    context: Pick<Context, 'database' | 'cache' | 'swrQueue' | 'timer'>,
  ): Promise<S>

  removeCacheEntry(
    payload: Payload,
    context: Pick<Context, 'cache'>,
  ): Promise<void>

  removeCacheEntries(
    payloads: Payload[],
    context: Pick<Context, 'cache'>,
  ): Promise<void>

  spec: ResolverSpec<Payload, Result>
}
