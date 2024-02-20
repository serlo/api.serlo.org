import { option as O, function as F } from 'fp-ts'
import Redis from 'ioredis'
// @ts-expect-error Missing types
import createMsgpack from 'msgpack5'
import * as R from 'ramda'

import { createLockManager, LockManager } from './lock-manager'
import { log } from '../log'
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

interface UpdateFunction<T> {
  getValue: (current?: T) => AsyncOrSync<T | undefined>
}
export type FunctionOrValue<T> = UpdateFunction<T> | { value: T }

export interface Cache {
  get<T>(args: { key: string; maxAge?: Time }): Promise<O.Option<CacheEntry<T>>>
  set<T>(
    payload: {
      key: string
      source: string
      ttlInSeconds?: number
      priority?: Priority
    } & FunctionOrValue<T>,
  ): Promise<void>
  remove(args: { key: string }): Promise<void>
  ready(): Promise<void>
  flush(): Promise<void>
  quit(): Promise<void>
}

export function createCache({ timer }: { timer: Timer }): Cache {
  const redisUrl = new URL(process.env.REDIS_URL)
  const client = new Redis({
    host: redisUrl.hostname,
    port: Number(redisUrl.port),
    retryStrategy(times) {
      log.error(`\nTrying to reconnect to redis, ${times}th attempt\n`)

      const delay = 2000
      // return any value that is not a number to stop retrying.
      if (times * delay > 300_000) throw new Error('Redis connection timed out')
      return delay
    },
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

  async function set<T>(
    this: Cache,
    payload: {
      key: string
      source: string
      priority?: Priority
      ttlInSeconds?: number
    } & FunctionOrValue<T>,
  ) {
    const { key, priority = Priority.High, source, ttlInSeconds } = payload
    const lockManager = lockManagers[priority]

    const lock = await lockManager.lock(key)
    try {
      let value: T | undefined

      if (isFunction(payload)) {
        const current = F.pipe(
          await this.get<T>({ key }),
          O.map((entry) => entry.value),
          O.toUndefined,
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

      const THREE_DAYS = 60 * 60 * 24 * 3

      await client.expire(key, ttlInSeconds ?? THREE_DAYS)
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
    },
  ): Promise<O.Option<CacheEntry<T>>> {
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
      for (const lockManager of Object.values(lockManagers)) {
        await lockManager.quit()
      }

      await client.quit()
    },
  }
}

export function createEmptyCache(): Cache {
  return {
    get: () => Promise.resolve(O.none),
    set: async () => {},
    remove: async () => {},
    ready: async () => {},
    flush: async () => {},
    quit: async () => {},
  }
}

export function createNamespacedCache(cache: Cache, namespace: string): Cache {
  return {
    get(args) {
      return cache.get({ ...args, key: namespace + args.key })
    },
    set(args) {
      return cache.set({ ...args, key: namespace + args.key })
    },
    remove(args) {
      return cache.remove({ ...args, key: namespace + args.key })
    },
    ready() {
      return cache.ready()
    },
    flush() {
      return cache.flush()
    },
    quit() {
      return cache.quit()
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
