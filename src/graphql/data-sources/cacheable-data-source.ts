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

import { Cache } from '../environment'

export abstract class CacheableDataSource extends RESTDataSource {
  constructor(private cache: Cache) {
    super()
  }

  public async setCache<Value>({
    key,
    update,
    ttl,
  }: {
    key: string
    update: UpdateFunction<Value>
    ttl?: number
  }): Promise<Value> {
    ttl = ttl ?? O.toUndefined(await this.cache.getTtl(key))
    const newEntry = await this.setValue({ key, value: await update(), ttl })

    return newEntry.value
  }

  protected async getFromCache<Value>({
    key,
    update,
    maxAge,
  }: {
    key: string
    update: UpdateFunction<Value>
    maxAge?: number
  }): Promise<Value> {
    if (maxAge === undefined) maxAge = Number.POSITIVE_INFINITY

    if (maxAge < 0) throw new Error('maxAge is negative')

    const updateCacheEntry = () => this.setCache({ key, update })
    const cacheEntry = await this.cache.get<unknown>(key)

    if (O.isNone(cacheEntry)) return await updateCacheEntry()

    const cacheValue = cacheEntry.value
    const entry = isEntry<Value>(cacheValue)
      ? cacheValue
      : await this.setValue({ key, value: cacheValue as Value })

    const age = Date.now() - entry.lastModified

    if (age <= maxAge * 1000) return entry.value

    // update cache in the background -> thus we do not use "await" here
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    updateCacheEntry()

    return entry.value
  }

  private async setValue<Value>({
    key,
    value,
    ttl,
  }: {
    key: string
    value: Value
    ttl?: number
  }): Promise<Entry<Value>> {
    const newEntry = { value, lastModified: Date.now() }

    await this.cache.set(key, newEntry, { ttl })

    return newEntry
  }

  public abstract updateCache(key: string): Promise<void>
}

interface Entry<Value> {
  value: Value
  lastModified: number
}

function isEntry<Value>(entry: unknown): entry is Entry<Value> {
  return R.has('lastModified', entry) && R.has('value', entry)
}

type UpdateFunction<Value> = () => Promise<Value>
