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
import { option as O } from 'fp-ts'
import * as t from 'io-ts'
import * as R from 'ramda'

import { FunctionOrValue } from '../cache'
import { Environment } from '../environment'
import { Time } from '../swr-queue'
import { InvalidValueError } from './common'

export function createQuery<P, R>(
  spec: QuerySpec<P, R>,
  environment: Environment
): Query<P, R> {
  async function queryWithDecoder<S extends R>(
    payload: P,
    customDecoder?: t.Type<S>
  ): Promise<S> {
    const key = spec.getKey(payload)
    const cacheValue = await environment.cache.get<R>({ key })

    const decoder = customDecoder ?? t.unknown

    if (O.isSome(cacheValue)) {
      const { value } = cacheValue.value

      if (decoder.is(value)) {
        if (
          spec.swrFrequency === undefined ||
          Math.random() < spec.swrFrequency
        ) {
          await environment.swrQueue.queue({ key })
        }

        return value as S
      }
    }

    // Cache empty or invalid value
    const value = await spec.getCurrentValue(payload, null)

    if (decoder.is(value)) {
      await environment.cache.set({ key, value })
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
        toPayloadArray(args).map((payload) =>
          environment.cache.set({ key: spec.getKey(payload), ...args })
        )
      )
    },
  }

  query._querySpec = querySpecWithHelpers
  query.__typename = 'Query'

  return (query as unknown) as Query<P, R>
}

export function isQuery(query: unknown): query is Query<unknown, unknown> {
  return R.has('__typename', query) && query.__typename === 'Query'
}

export interface QuerySpec<Payload, Result> {
  // TODO: this should probably be required
  decoder?: t.Type<Result>
  getCurrentValue: (
    payload: Payload,
    previousValue: Result | null
  ) => Promise<unknown>
  enableSwr: boolean
  swrFrequency?: number
  maxAge: Time | undefined
  getKey: (payload: Payload) => string
  getPayload: (key: string) => O.Option<Payload>
}

export type Query<Payload, Result> = (Payload extends undefined
  ? () => Promise<Result>
  : (payload: Payload) => Promise<Result>) & {
  _querySpec: QuerySpecWithHelpers<Payload, Result>
  __typename: 'CachedQuery'
}

export interface QuerySpecWithHelpers<Payload, Result>
  extends QuerySpec<Payload, Result> {
  setCache: (
    args: PayloadArrayOrPayload<Payload> & FunctionOrValue<Result>
  ) => Promise<void>
  queryWithDecoder<S extends Result>(
    payload: Payload,
    customDecoder: t.Type<S>
  ): Promise<S>
  queryWithDecoders<S2 extends Result, S1 extends S2>(
    payload: Payload,
    customDecoder1: t.Type<S1>,
    customDecoder2: t.Type<S2>
  ): Promise<S2>
}

type PayloadArrayOrPayload<P> = { payload: P } | { payloads: P[] }

function toPayloadArray<P>(arg: PayloadArrayOrPayload<P>): P[] {
  return R.has('payloads', arg) ? arg.payloads : [arg.payload]
}
