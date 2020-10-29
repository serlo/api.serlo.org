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

import { Cache } from '../graphql/environment'

interface Entry {
  value: unknown
  lastModified: number
  ttl?: number
}

export function createInMemoryCache(): Cache {
  let cache: Record<string, Entry | null> = {}

  return {
    // eslint-disable-next-line @typescript-eslint/require-await
    get: async <T>(key: string) => {
      const isAlive = (x: Entry) => {
        const ttl = (x.ttl ?? Number.POSITIVE_INFINITY) * 1000

        return Date.now() - x.lastModified < ttl
      }

      return pipeable.pipe(
        O.fromNullable(cache[key]),
        O.chain(O.fromPredicate(isAlive)),
        O.map((x) => x.value as T)
      )
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    async set(key, value, options) {
      cache[key] = { value, ttl: options?.ttl, lastModified: Date.now() }
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    async remove(key: string) {
      cache[key] = null
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    async flush() {
      cache = {}
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    async getTtl(key: string): Promise<O.Option<number>> {
      const value = cache[key]
      return pipeable.pipe(
        O.fromNullable(value),
        O.chain((x) => O.fromNullable(x.ttl))
      )
    },
  }
}
