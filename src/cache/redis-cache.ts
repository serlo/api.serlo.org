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
import redis from 'redis'
import * as util from 'util'

import { Cache, SetCacheOptions } from '../graphql/environment'

export function createRedisCache({ host }: { host: string }): Cache {
  const client = redis.createClient({
    host,
    port: 6379,
    return_buffers: true,
  })
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const get = (util.promisify(client.get).bind(client) as unknown) as (
    key: string
  ) => Promise<Buffer | null>
  const del = (util.promisify(client.del).bind(client) as unknown) as (
    key: string
  ) => Promise<void>
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const set = (util.promisify(client.set).bind(client) as unknown) as (
    key: string,
    value: Buffer,
    flags?: 'EX',
    ttl?: number
  ) => Promise<void>
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const ttl = (util.promisify(client.ttl).bind(client) as unknown) as (
    key: string
  ) => Promise<number | undefined>
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const flushdb = util.promisify(client.flushdb).bind(client)

  return {
    get: async <T>(key: string) => {
      return pipeable.pipe(
        await get(key),
        O.fromNullable,
        O.map((v) => msgpack.unpack(v) as T)
      )
    },
    async set(key, value, options) {
      const packedValue = msgpack.pack(value) as Buffer
      const ttl = options?.ttl
      if (ttl === undefined) {
        await set(key, packedValue)
      } else {
        await set(key, packedValue, 'EX', ttl)
      }
    },
    async setAndReturnPreviousValue<T>(
      key: string,
      value: T,
      options?: SetCacheOptions
    ) {
      const previousValue = await this.get<T>(key)
      await this.set(key, value, options)
      return previousValue
    },
    async remove(key: string) {
      await del(key)
    },
    async flush() {
      await flushdb()
    },
    async getTtl(key) {
      return O.fromNullable(await ttl(key))
    },
  }
}
