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

export interface QuerySpec<P, R> {
  // TODO: this should probably be required
  decoder?: t.Type<R>
  enableSwr: boolean
  getCurrentValue: (payload: P, previousValue: R | null) => Promise<R>
  maxAge: Time | undefined
  getKey: (payload: P) => string
  getPayload: (key: string) => O.Option<P>
}

export interface QuerySpecWithHelpers<P, R> extends QuerySpec<P, R> {
  setCache: (
    args: PayloadArrayOrPayload<P> & FunctionOrValue<R>
  ) => Promise<void>
}

interface Payload<P> {
  payload: P
}
interface ArrayPayload<P> {
  payloads: P[]
}
export type PayloadArrayOrPayload<P> = Payload<P> | ArrayPayload<P>

export type Query<P, R> = (P extends undefined
  ? () => Promise<R>
  : (payload: P) => Promise<R>) & {
  _querySpec: QuerySpecWithHelpers<P, R>
}

export function createQuery<P, R>(
  spec: QuerySpec<P, R>,
  environment: Environment
): Query<P, R> {
  async function query(payload: P): Promise<R> {
    const key = spec.getKey(payload)
    const cacheValue = await environment.cache.get<R>({ key })

    const decoder = spec.decoder || t.unknown

    if (O.isSome(cacheValue)) {
      const cacheEntry = cacheValue.value

      const decoded = decoder.decode(cacheEntry.value)
      if (E.isRight(decoded)) {
        await environment.swrQueue.queue({
          key,
        })
        return decoded.right as R
      }
    }

    // Cache empty or invalid value
    const value = await spec.getCurrentValue(payload, null)

    const decoded = decoder.decode(value)
    if (E.isRight(decoded)) {
      await environment.cache.set({
        key,
        value,
      })
      return value
    }

    throw new Error(`Invalid value: ${JSON.stringify(value)}`)
  }

  const querySpecWithHelpers: QuerySpecWithHelpers<P, R> = {
    ...spec,
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

  return (query as unknown) as Query<P, R>
}

export function isQuery(query: unknown): query is Query<unknown, unknown> {
  return R.has('_querySpec', query) && query._querySpec !== undefined
}

function toPayloadArray<P>(arg: PayloadArrayOrPayload<P>): P[] {
  return R.has('payloads', arg) ? arg.payloads : [arg.payload]
}
