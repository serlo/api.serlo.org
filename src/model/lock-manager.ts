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
import redis from 'redis'
import Redlock from 'redlock'

export interface LockManager {
  lock(key: string): Promise<Lock>
  quit(): Promise<void>
}

export interface Lock {
  unlock(): Promise<void>
}

export function createLockManager({
  host,
  retryCount,
}: {
  host: string
  retryCount: number
}): LockManager {
  const client = redis.createClient({
    host,
    port: 6379,
    return_buffers: true,
  })
  const redlock = new Redlock([client], { retryCount })

  return {
    async lock(key: string) {
      return await redlock.lock(`locks:${key}`, 10000)
    },
    async quit() {
      await new Promise((resolve) => {
        client.quit(() => {
          resolve()
        })
      })
    },
  }
}
