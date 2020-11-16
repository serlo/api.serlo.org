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
import { option as O } from 'fp-ts'
import * as R from 'ramda'

import { Environment } from '../environment'

export const HOUR = 60 * 60
export const DAY = 24 * HOUR

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
      const initialValue = await update()
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
    if (await this.lock(key)) {
      await this.setValue({ key, value: await update() })
      await this.unlock(key)
    }
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

  private async lock(key: string): Promise<boolean> {
    const lock = await this.environment.cache.setAndReturnPreviousValue<
      boolean
    >(this.getLockKey(key), true)
    return O.isNone(lock) || lock.value === false
  }

  private async unlock(key: string): Promise<void> {
    return this.environment.cache.remove(this.getLockKey(key))
  }

  private getLockKey(key: string): string {
    return `lock:${key}`
  }
}

interface Entry<Value> {
  value: Value
  lastModified: number
}

function isEntry<Value>(entry: unknown): entry is Entry<Value> {
  return R.has('lastModified', entry) && R.has('value', entry)
}

type UpdateFunction<Value> = () => Promise<Value>
