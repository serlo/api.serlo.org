import { option as O, function as F } from 'fp-ts'
import Redis from 'ioredis'
// @ts-expect-error Missing types
import createMsgpack from 'msgpack5'
import * as R from 'ramda'
import Redlock from 'redlock'

import { captureErrorEvent } from './error-event'
import { Priority, Cache, CacheEntry } from '~/context/cache'
import { timeToMilliseconds, Time, Timer } from '~/timer'
import { FunctionOrValue, isUpdateFunction } from '~/utils'

const msgpack = (
  createMsgpack as () => {
    encode(value: unknown): Buffer
    decode(buffer: Buffer): unknown
  }
)()

export function createCache({ timer }: { timer: Timer }): Cache {
  const redisUrl = new URL(process.env.REDIS_URL)
  const client = new Redis({
    host: redisUrl.hostname,
    port: Number(redisUrl.port),
    retryStrategy(times) {
      const delay = 2000
      // return any value that is not a number to stop retrying.
      if (times * delay > 300_000) throw new Error('Redis connection timed out')
      return delay
    },
    maxRetriesPerRequest: 3,
  })

  client.on('error', (error) => {
    captureErrorEvent({
      error,
      location: 'cache',
    })
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

      if (isUpdateFunction(payload)) {
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

function createLockManager({
  retryCount,
}: {
  retryCount: number
}): LockManager {
  const client = new Redis(process.env.REDIS_URL)
  client.on('error', (error) => {
    captureErrorEvent({
      error,
      location: 'Cache lockManager',
    })
    client.disconnect()
  })
  const redlock = new Redlock([client], { retryCount })

  return {
    async lock(key: string) {
      const lock = await redlock.acquire([`locks:${key}`], 10000)

      return {
        unlock: async () => {
          await lock.release()
        },
      }
    },
    async quit() {
      await client.quit()
    },
  }
}

interface LockManager {
  lock(key: string): Promise<{ unlock(): Promise<void> }>
  quit(): Promise<void>
}

function isCacheEntry<Value>(value: unknown): value is CacheEntry<Value> {
  return R.has('lastModified', value) && R.has('value', value)
}
