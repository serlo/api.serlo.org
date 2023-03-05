/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { option as O, function as F } from 'fp-ts'
import Redis from 'ioredis'
// @ts-expect-error Missing types
import createMsgpack from 'msgpack5'
import * as R from 'ramda'

import { createLockManager, LockManager } from './lock-manager'
import { log } from '../log'
import { redisUrl } from '../redis-url'
import { Time, timeToMilliseconds } from '../swr-queue'
import { Timer } from '../timer'
import { AsyncOrSync } from '~/utils'

const msgpack = (
  createMsgpack as () => {
    encode(value: unknown): Buffer
    decode(buffer: Buffer): unknown
  }
)()

export enum Priority {
  Low,
  High,
}

export interface UpdateFunction<T> {
  getValue: (current?: T) => AsyncOrSync<T | undefined>
}
export type FunctionOrValue<T> = UpdateFunction<T> | { value: T }

export interface Cache {
  get<T>(args: { key: string; maxAge?: Time }): Promise<O.Option<CacheEntry<T>>>
  set<T>(
    payload: {
      key: string
      source: string
      priority?: Priority
    } & FunctionOrValue<T>
  ): Promise<void>
  remove(args: { key: string }): Promise<void>
  ready(): Promise<void>
  flush(): Promise<void>
  quit(): Promise<void>
}

export function createCache({ timer }: { timer: Timer }): Cache {
  const client = new Redis(redisUrl)
  const lockManagers: Record<Priority, LockManager> = {
    [Priority.Low]: createLockManager({
      retryCount: 0,
    }),
    [Priority.High]: createLockManager({
      retryCount: 10,
    }),
  }

  let isReady = false

  async function set<T>(
    this: Cache,
    payload: {
      key: string
      source: string
      priority?: Priority
    } & FunctionOrValue<T>
  ) {
    const { key, priority = Priority.High, source } = payload
    const lockManager = lockManagers[priority]

    const lock = await lockManager.lock(key)
    try {
      let value: T | undefined

      if (isFunction(payload)) {
        const current = F.pipe(
          await this.get<T>({ key }),
          O.map((entry) => entry.value),
          O.toUndefined
        )

        value = await payload.getValue(current)
      } else {
        value = payload.value
      }

      if (value === undefined) return

      const valueWithTimestamp: CacheEntry<T> = {
        value,
        source,
        lastModified: timer.now(),
      }
      const packedValue = msgpack.encode(valueWithTimestamp)
      await client.set(key, packedValue)
    } catch (e) {
      log.error(`Failed to set key "${key}":`, e)
      throw e
    } finally {
      await lock.unlock()
    }
  }

  async function get<T>(
    this: Cache,
    {
      key,
      maxAge,
    }: {
      key: string
      maxAge?: Time
    }
  ): Promise<O.Option<CacheEntry<T>>> {
    if(process.env.ENVIRONMENT === 'local'){
      return O.none
    }
    const packedValue = await client.getBuffer(key)
    if (packedValue === null) return O.none

    const value = msgpack.decode(packedValue)

    if (!isCacheEntry<T>(value)) return O.none
    if (maxAge && timer.now() - value.lastModified > timeToMilliseconds(maxAge))
      return O.none

    return O.some(value)
  }

  const ready = async () => {
    if (isReady) return
    await new Promise<void>((resolve) => {
      client.on('ready', () => {
        isReady = true
        resolve()
      })
    })
  }

  return {
    get,
    set,
    async remove({ key }: { key: string }) {
      await client.del(key)
    },
    ready,
    async flush() {
      await client.flushdb()
    },
    async quit() {
      await client.quit()
    },
  }
}

export interface CacheEntry<Value> {
  value: Value
  lastModified: number
  source: string
}

function isCacheEntry<Value>(value: unknown): value is CacheEntry<Value> {
  return R.has('lastModified', value) && R.has('value', value)
}

function isFunction<T>(arg: FunctionOrValue<T>): arg is UpdateFunction<T> {
  return R.has('getValue', arg) && typeof arg.getValue === 'function'
}
