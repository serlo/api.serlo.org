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
import { option as O, pipeable } from 'fp-ts'

import { createModel, Model } from '../../model'
import { Environment } from '../environment'

export const MINUTE = 60
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR

export abstract class CacheableDataSource extends RESTDataSource {
  protected model: Model

  constructor(protected environment: Environment) {
    super()
    this.model = createModel({
      ...this.environment,
      // TODO: seems like fetch isn't exposed. So we either need to focus on GET or don't use the model here
      fetch: ({ path, params, ...init }) => {
        // @ts-expect-error This is still Hacky and WIP, ignore the type mismatch for now
        return this.get(path, params, init)
      },
    })
  }

  // TODO: here we probably shouldn't need `update` since the model already
  // encapsulates all the relevant information
  public async getCacheValue<Value>({
    key,
    update,
    maxAge,
  }: {
    key: string
    update: UpdateFunction<Value>
    maxAge?: number
  }): Promise<Value> {
    return await pipeable.pipe(
      await this.environment.cache.get<Value>(key),
      O.fold(
        async () => {
          const initialValue = await update(null)
          await this.environment.cache.set(key, initialValue)
          return initialValue
        },
        async (cacheEntry) => {
          await this.environment.swrQueue.queue({
            key,
            maxAge,
          })
          return cacheEntry.value
        }
      )
    )
  }

  public async updateCacheValue({ key }: { key: string }): Promise<void> {
    await this.model.update(key)
  }

  // TODO: do we need update here? This is the entry for mutations btw.
  public async setCacheValue<Value>({
    key,
    update,
  }: {
    key: string
    update: UpdateFunction<Value>
  }): Promise<void> {
    try {
      const lock = await this.environment.lockManager.lock(key)
      try {
        const currentValue = pipeable.pipe(
          await this.environment.cache.get<Value>(key),
          O.map((entry) => entry.value),
          O.toNullable
        )
        const value = await update(currentValue)
        await this.environment.cache.set(key, value)
      } catch (e) {
        // Ignore exceptions
      } finally {
        await lock.unlock()
      }
    } catch (e) {
      // Resource already locked, skip update
    }
  }
}

type UpdateFunction<Value> = (current: Value | null) => Promise<Value>
