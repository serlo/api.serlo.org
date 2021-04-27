/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { RESTDataSource } from 'apollo-datasource-rest'

import { Environment } from '~/internals/environment'
import { createGoogleSpreadsheetApiModel, createSerloModel } from '~/model'

export class ModelDataSource extends RESTDataSource {
  public googleSpreadsheetApi: ReturnType<
    typeof createGoogleSpreadsheetApiModel
  >
  public serlo: ReturnType<typeof createSerloModel>

  constructor(private environment: Environment) {
    super()
    const args = {
      environment,
    }
    this.serlo = createSerloModel(args)
    this.googleSpreadsheetApi = createGoogleSpreadsheetApiModel(args)
  }

  public async removeCacheValue({ key }: { key: string }) {
    await this.environment.cache.remove({ key })
  }

  public async setCacheValue(args: { key: string; value: unknown }) {
    await this.environment.cache.set(args)
  }

  public async updateCacheValue({ key }: { key: string }) {
    await this.environment.swrQueue.queue({ key })
  }
}
