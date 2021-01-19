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
import { option as O } from 'fp-ts'
import msgpack from 'msgpack'
import * as R from 'ramda'
import redis from 'redis'
import * as util from 'util'

import { log } from '../log'
import { redisUrl } from '../redis-url'
import { Timer } from '../timer'
import { createLockManager, LockManager } from './lock-manager'

export enum Priority {
  Low,
  High,
}

export type FunctionOrValue<T> = { getValue: () => Promise<T> } | { value: T }

export interface Cache {
  get<T>({ key }: { key: string }): Promise<O.Option<CacheEntry<T>>>
  set<T>(
    payload: {
      key: string
      priority?: Priority
    } & FunctionOrValue<T>
  ): Promise<void>
  remove({ key }: { key: string }): Promise<void>
  ready(): Promise<void>
  flush(): Promise<void>
  quit(): Promise<void>
}

export function createCache({ timer }: { timer: Timer }): Cache {
  const client = redis.createClient({
    url: redisUrl,
    return_buffers: true,
  })
  const lockManagers: Record<Priority, LockManager> = {
    [Priority.Low]: createLockManager({
      retryCount: 0,
    }),
    [Priority.High]: createLockManager({
      retryCount: 10,
    }),
  }

  let isReady = false

  const set = async <T>(
    payload: {
      key: string
      priority?: Priority
    } & FunctionOrValue<T>
  ) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const clientSet = (util.promisify(client.set).bind(client) as unknown) as (
      key: string,
      value: Buffer
    ) => Promise<void>

    const { key, priority = Priority.High } = payload
    const lockManager = lockManagers[priority]
    try {
      const lock = await lockManager.lock(key)
      try {
        const value = isFunction(payload)
          ? await payload.getValue()
          : payload.value
        const valueWithTimestamp = {
          value,
          lastModified: timer.now(),
        }
        const packedValue = msgpack.pack(valueWithTimestamp) as Buffer
        await clientSet(key, packedValue)
      } catch (e) {
        log.error(`Failed to set key "${key}":`, e)
      } finally {
        await lock.unlock()
      }
    } catch (e) {
      log.debug(`Failed to acquire lock for key "${key}":`, e)
    }
  }

  const get = async <T>({
    key,
  }: {
    key: string
  }): Promise<O.Option<CacheEntry<T>>> => {
    const clientGet = (util
      // eslint-disable-next-line @typescript-eslint/unbound-method
      .promisify(client.get)
      .bind(client) as unknown) as (key: string) => Promise<Buffer | null>

    const packedValue = await clientGet(key)
    if (packedValue === null) return O.none

    const value = msgpack.unpack(packedValue) as T | CacheEntry<T>

    if (isCacheEntryWithTimestamp<T>(value)) {
      return O.some(value)
    }

    await set({ key, value })
    return get({ key })
  }

  const remove = async ({ key }: { key: string }) => {
    const clientRemove = (util
      .promisify(client.del)
      .bind(client) as unknown) as (key: string) => Promise<void>

    await clientRemove(key)
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

  const flush = async () => {
    const clientFlush = (util
      // eslint-disable-next-line @typescript-eslint/unbound-method
      .promisify(client.flushdb)
      .bind(client) as unknown) as () => Promise<void>

    await clientFlush()
  }

  const quit = async () => {
    const clientQuit = (util
      // eslint-disable-next-line @typescript-eslint/unbound-method
      .promisify(client.quit)
      .bind(client) as unknown) as () => Promise<void>

    await Promise.all([
      clientQuit(),
      ...Object.values(lockManagers).map((lockManager) => lockManager.quit()),
    ])
  }

  return {
    get,
    set,
    remove,
    ready,
    flush,
    quit,
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

function isFunction<T>(
  payload: FunctionOrValue<T>
): payload is { getValue: () => Promise<T> } {
  return (
    typeof (payload as { getValue: () => Promise<T> }).getValue === 'function'
  )
}
