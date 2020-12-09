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

import { log } from './log'
import { redisUrl } from './redis-url'

export interface LockManager {
  lock(key: string): Promise<Lock>
  quit(): Promise<void>
}

export interface Lock {
  unlock(): Promise<void>
}

export function createLockManager({
  retryCount,
}: {
  retryCount: number
}): LockManager {
  const client = redis.createClient({
    url: redisUrl,
  })
  const redlock = new Redlock([client], { retryCount })

  redlock.on('clientError', function (err) {
    log.error('A redis error has occurred:', err)
  })

  return {
    async lock(key: string) {
      log.debug('Locking key', key)
      const lock = await redlock.lock(`locks:${key}`, 10000)
      return {
        unlock() {
          log.debug('Unlocking key', key)
          return lock.unlock()
        },
      }
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
