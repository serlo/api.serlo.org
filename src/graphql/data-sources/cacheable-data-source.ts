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
import { RESTDataSource } from 'apollo-datasource-rest'
import { randomBytes } from 'crypto'
import { option as O, pipeable } from 'fp-ts'
import * as R from 'ramda'

import { Environment } from '../environment'

export const MINUTE = 60
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR

const inMemoryLock: Record<string, string> = {}

export abstract class CacheableDataSource extends RESTDataSource {
  constructor(protected environment: Environment) {
    super()
  }

  public abstract updateCacheValue(key: string): Promise<void>

  public async getCacheValue<Value>({
    key,
    update,
    maxAge,
  }: {
    key: string
    update: UpdateFunction<Value>
    maxAge?: number
  }): Promise<Value> {
    const cacheEntry = await this.environment.cache.get<unknown>(key)

    if (O.isNone(cacheEntry)) {
      const initialValue = await update(null)
      await this.setValue({ key, value: initialValue })
      return initialValue
    }

    const cacheValue = cacheEntry.value
    const entry = isEntry<Value>(cacheValue)
      ? cacheValue
      : await this.setValue({ key, value: cacheValue as Value })

    const age = this.environment.timer.now() - entry.lastModified

    if (maxAge === undefined || age <= maxAge * 1000) return entry.value

    // update cache in the background -> thus we do not use "await" here
    void this.setCacheValue({ key, update })

    return entry.value
  }

  public async setCacheValue<Value>({
    key,
    update,
  }: {
    key: string
    update: UpdateFunction<Value>
  }): Promise<void> {
    await pipeable.pipe(
      this.lock(key),
      O.fold(
        async () => {},
        async (lock) => {
          await this.updateValue({
            key,
            update,
            lock,
          })
        }
      )
    )
  }

  public async UNSAFE_setCacheValueWithoutLock<Value>({
    key,
    update,
  }: {
    key: string
    update: UpdateFunction<Value>
  }): Promise<void> {
    // Do update even when resource is locked.
    const lock = this.UNSAFE_lock(key)
    await this.updateValue({
      key,
      update,
      lock,
    })
  }

  private async setValue<Value>({
    key,
    value,
  }: {
    key: string
    value: Value
  }): Promise<Entry<Value>> {
    const newEntry = { value, lastModified: this.environment.timer.now() }
    await this.environment.cache.set(key, newEntry)
    return newEntry
  }

  private async updateValue<Value>({
    key,
    update,
    lock,
  }: {
    key: string
    update: UpdateFunction<Value>
    lock: Lock
  }) {
    const currentValue = pipeable.pipe(
      await this.environment.cache.get<unknown>(key),
      O.chain(O.fromPredicate(isEntry)),
      O.map((entry) => entry.value as Value),
      O.toNullable
    )
    try {
      await this.setValue({ key, value: await update(currentValue) })
    } catch (e) {
      // Ignore exceptions
    } finally {
      lock.unlock()
    }
  }

  private lock(key: string): O.Option<Lock> {
    const isLocked = inMemoryLock[key] !== undefined
    return isLocked ? O.none : O.some(this.UNSAFE_lock(key))
  }

  private UNSAFE_lock(key: string): Lock {
    const lockId = randomBytes(8).toString('hex')
    inMemoryLock[key] = lockId
    return {
      unlock,
    }

    function unlock() {
      if (inMemoryLock[key] !== lockId) return
      delete inMemoryLock[key]
    }
  }
}

interface Lock {
  unlock(): void
}

interface Entry<Value> {
  value: Value
  lastModified: number
}

function isEntry<Value>(entry: unknown): entry is Entry<Value> {
  return R.has('lastModified', entry) && R.has('value', entry)
}

type UpdateFunction<Value> = (current: Value | null) => Promise<Value>
