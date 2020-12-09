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
import { RequestInit } from 'node-fetch'

import { Cache } from './cache'
import { LockManager } from './lock-manager'
import { log } from './log'
import { Instance } from './types'

type Fetch<Result = unknown> = (
  init: RequestInit & { path: string }
) => Promise<Result>

export interface Model {
  update(key: string): Promise<void>
}

// Decouple our business logic from the actual used fetch. This way, we can use Apollo's internals, too.
export function createModel({
  cache,
  lockManager,
  fetch,
}: {
  cache: Cache
  lockManager: LockManager
  fetch: Fetch
}) {
  // TODO: might move that into cache itself?
  async function setCacheWithLock(key: string, f: () => Promise<unknown>) {
    try {
      const lock = await lockManager.lock(key)
      try {
        const value = await f()
        await cache.set(key, value)
      } catch (e) {
        log.error('Error while trying to update key', key, ':', e)
      } finally {
        await lock.unlock()
      }
    } catch (e) {
      log.debug('Key', key, 'already locked:', e)
    }
  }

  return {
    async update(key: string) {
      if (key.includes('serlo.org')) {
        const instance = key.slice(0, 2)
        if (!isInstance(instance)) {
          throw new Error(`"${instance} is not a valid instance.`)
        }
        const path = key.slice(`${instance}.serlo.org`.length)
        await setCacheWithLock(key, async () => {
          return await fetch({
            path: `http://${instance}.${process.env.SERLO_ORG_HOST}${path}`,
          })
        })
      } else if (key.includes('spreadsheet-')) {
        // Google Spreadsheet
        // TODO:
      }
    },
  }
}

export function isInstance(instance: string): instance is Instance {
  return Object.values(Instance).includes(instance as Instance)
}
