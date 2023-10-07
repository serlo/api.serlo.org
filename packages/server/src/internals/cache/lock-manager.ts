import Redis from 'ioredis'
import Redlock from 'redlock'

import { log } from '../log'
import { redisUrl } from '../redis-url'

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
  const client = new Redis(redisUrl)
  const redlock = new Redlock([client], { retryCount })

  redlock.on('clientError', function (err) {
    log.error('A redis error has occurred:', err)
  })

  return {
    async lock(key: string) {
      log.debug('Locking key', key)
      const lock = await redlock.acquire([`locks:${key}`], 10000)
      return {
        async unlock() {
          log.debug('Unlocking key', key)
          await lock.release()
        },
      }
    },
    async quit() {
      await client.quit()
    },
  }
}
