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
import { option as O, either as E } from 'fp-ts'
import * as t from 'io-ts'
import * as R from 'ramda'

import { FunctionOrValue } from '../cache'
import { Environment } from '../environment'
import { Time } from '../swr-queue'

export interface RequestSpec<P, R> {
  decoder: t.Type<R>
  getCurrentValue: (payload: P) => Promise<unknown>
}

export interface QuerySpec<P, R> {
  // TODO: this should probably be required
  decoder?: t.Type<R>
  getCurrentValue: (payload: P, previousValue: R | null) => Promise<R | unknown>
  enableSwr: boolean
  swrFrequency?: number
  maxAge: Time | undefined
  getKey: (payload: P) => string
  getPayload: (key: string) => O.Option<P>
}

export interface QuerySpecWithHelpers<P, R> extends QuerySpec<P, R> {
  setCache: (
    args: PayloadArrayOrPayload<P> & FunctionOrValue<R>
  ) => Promise<void>
  queryWithDecoder<S extends R>(
    payload: P,
    customDecoder: t.Type<S>
  ): Promise<S>
  queryWithDecoders<S2 extends R, S1 extends S2>(
    payload: P,
    customDecoder1: t.Type<S1>,
    customDecoder2: t.Type<S2>
  ): Promise<S2>
}

export type PayloadArrayOrPayload<P> = { payload: P } | { payloads: P[] }

export type ModelRequest<P, R> = ((payload: P) => Promise<R>) & {
  _querySpec: RequestSpec<P, R>
}

export type ModelQuery<P, R> = (P extends undefined
  ? () => Promise<R>
  : (payload: P) => Promise<R>) & {
  _querySpec: QuerySpecWithHelpers<P, R>
  __typename: 'CachedQuery'
}

export function createRequest<P, R>(
  spec: RequestSpec<P, R>
): ModelRequest<P, R> {
  async function query(payload: P) {
    const value = await spec.getCurrentValue(payload)

    if (spec.decoder.is(value)) {
      return value
    } else {
      throw new Error('Illegal Value received')
    }
  }

  query._querySpec = spec

  return query
}

export function createQuery<P, R>(
  spec: QuerySpec<P, R>,
  environment: Environment
): ModelQuery<P, R> {
  async function queryWithDecoder<S extends R>(
    payload: P,
    customDecoder?: t.Type<S>
  ): Promise<S> {
    const key = spec.getKey(payload)
    const cacheValue = await environment.cache.get<R>({ key })

    const decoder = customDecoder ?? t.unknown

    if (O.isSome(cacheValue)) {
      const cacheEntry = cacheValue.value

      const decoded = decoder.decode(cacheEntry.value)
      if (E.isRight(decoded)) {
        if (
          spec.swrFrequency === undefined ||
          Math.random() < spec.swrFrequency
        ) {
          await environment.swrQueue.queue({
            key,
          })
        }

        return decoded.right as S
      }
    }

    // Cache empty or invalid value
    const value = await spec.getCurrentValue(payload, null)

    const decoded = decoder.decode(value)
    if (E.isRight(decoded)) {
      const value = decoded.right
      await environment.cache.set({
        key,
        value,
      })
      return value as S
    } else {
      throw new InvalidValueError(value)
    }
  }

  async function queryWithDecoders<S2 extends R, S1 extends S2>(
    payload: P,
    customDecoder1: t.Type<S1>,
    customDecoder2: t.Type<S2>
  ): Promise<S2> {
    try {
      return await queryWithDecoder(payload, customDecoder1)
    } catch (e) {
      return await queryWithDecoder(payload, customDecoder2)
    }
  }

  function query(payload: P): Promise<R> {
    return queryWithDecoder(payload, spec.decoder)
  }

  const querySpecWithHelpers: QuerySpecWithHelpers<P, R> = {
    ...spec,
    queryWithDecoder,
    queryWithDecoders,
    async setCache(args) {
      await Promise.all(
        R.map(async (payload) => {
          await environment.cache.set({
            key: spec.getKey(payload),
            ...args,
          })
        }, toPayloadArray(args))
      )
    },
  }

  query._querySpec = querySpecWithHelpers
  query.__typename = 'CachedQuery'

  return (query as unknown) as ModelQuery<P, R>
}

export class InvalidValueError extends Error {
  constructor(public invalidValue: unknown) {
    super('Invalid value received from a data source.')
  }
}

export function isQuery(query: unknown): query is ModelQuery<unknown, unknown> {
  return R.has('__typename', query) && query.__typename === 'CachedQuery'
}

function toPayloadArray<P>(arg: PayloadArrayOrPayload<P>): P[] {
  return R.has('payloads', arg) ? arg.payloads : [arg.payload]
}
