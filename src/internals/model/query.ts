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
import { option as O, pipeable } from 'fp-ts'

import { Environment } from '../environment'
import { Time } from '../swr-queue'

export interface QuerySpec<P, R> {
  enableSwr: boolean
  getCurrentValue: (payload: P, previousValue: R | null) => Promise<R>
  maxAge: Time | undefined
  getKey: (payload: P) => string
  getPayload: (key: string) => O.Option<P>
}

export type Query<P, R> = (P extends undefined
  ? () => Promise<R>
  : (payload: P) => Promise<R>) & {
  _querySpec: QuerySpec<P, R>
}

export function createQuery<P, R>(
  spec: QuerySpec<P, R>,
  environment: Environment
): Query<P, R> {
  async function query(payload: P): Promise<R> {
    const key = spec.getKey(payload)
    return await pipeable.pipe(
      await environment.cache.get<R>({ key }),
      O.fold(
        async () => {
          const value = await spec.getCurrentValue(payload, null)
          await environment.cache.set({
            key,
            value,
          })
          return value
        },
        async (cacheEntry) => {
          await environment.swrQueue.queue({
            key,
          })
          return cacheEntry.value
        }
      )
    )
  }
  query._querySpec = spec
  return (query as unknown) as Query<P, R>
}

export function isQuery(query: unknown): query is Query<unknown, unknown> {
  return (query as Query<unknown, unknown>)?._querySpec !== undefined
}
