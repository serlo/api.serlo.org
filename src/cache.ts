/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { option as O, pipeable } from 'fp-ts'
import msgpack from 'msgpack'
import * as R from 'ramda'
import redis from 'redis'
import * as util from 'util'

import { Timer } from './timer'

export interface Cache {
  get<T>(key: string): Promise<O.Option<CacheEntry<T>>>
  set(key: string, value: unknown): Promise<void>
  remove(key: string): Promise<void>
  flush(): Promise<void>
  quit(): Promise<void>
}

export function createCache({
  host,
  timer,
}: {
  host: string
  timer: Timer
}): Cache {
  const client = redis.createClient({
    host,
    port: 6379,
    return_buffers: true,
  })

  /* eslint-disable @typescript-eslint/unbound-method */
  const get = (util.promisify(client.get).bind(client) as unknown) as (
    key: string
  ) => Promise<Buffer | null>
  const del = (util.promisify(client.del).bind(client) as unknown) as (
    key: string
  ) => Promise<void>
  const set = (util.promisify(client.set).bind(client) as unknown) as (
    key: string,
    value: Buffer
  ) => Promise<void>
  /* eslint-enable @typescript-eslint/unbound-method */

  return {
    get: async <T>(key: string) => {
      return pipeable.pipe(
        await get(key),
        O.fromNullable,
        O.map((value) => msgpack.unpack(value) as T),
        O.map((value) => {
          return isCacheEntryWithTimestamp<T>(value)
            ? value
            : { value, lastModified: timer.now() }
        })
      )
    },
    async set(key, value) {
      const valueWithTimestamp = {
        value,
        lastModified: timer.now(),
      }
      const packedValue = msgpack.pack(valueWithTimestamp) as Buffer
      await set(key, packedValue)
    },
    async remove(key: string) {
      await del(key)
    },
    async flush() {
      return new Promise((resolve) => {
        client.flushdb(() => {
          resolve()
        })
      })
    },
    quit() {
      return new Promise((resolve) => {
        client.quit(() => {
          resolve()
        })
      })
    },
  }
}

export interface CacheEntry<Value> {
  value: Value
  lastModified: number
}

function isCacheEntryWithTimestamp<Value>(
  entry: unknown
): entry is CacheEntry<Value> {
  return R.has('lastModified', entry) && R.has('value', entry)
}
