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
import jwt from 'jsonwebtoken'

import { Instance } from '../../types'
import { Service } from '../schema/types'
import { CacheableDataSource, HOUR } from './cacheable-data-source'

export class SerloDataSource extends CacheableDataSource {
  private async cacheAwareGet<T>({
    path,
    instance,
    maxAge,
  }: {
    path: string
    instance?: Instance
    maxAge?: number
  }): Promise<T> {
    return this.getCacheValue({
      key: this.getCacheKey(path, instance),
      update: () => this.getFromSerlo({ path, instance }),
      maxAge,
    })
  }

  private async getFromSerlo<T>({
    path,
    instance = Instance.De,
  }: {
    path: string
    instance?: Instance
  }): Promise<T> {
    return await super.get<T>(
      `http://${instance}.${process.env.SERLO_ORG_HOST}${path}`,
      {},
      {
        headers: {
          Authorization: `Serlo Service=${getToken()}`,
        },
      }
    )
  }

  private getCacheKey(path: string, instance: Instance = Instance.De) {
    return `${instance}.serlo.org${path}`
  }

  public async getAllCacheKeys(): Promise<string[]> {
    return this.cacheAwareGet<string[]>({
      path: '/api/cache-keys',
      maxAge: 1 * HOUR,
    })
  }

  public async removeCache(key: string) {
    await this.environment.cache.remove({ key })
  }
}

function getToken() {
  return jwt.sign({}, process.env.SERLO_ORG_SECRET, {
    expiresIn: '2h',
    audience: Service.Serlo,
    issuer: 'api.serlo.org',
  })
}
