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
import { option as O, either as E } from 'fp-ts'
import reporter from 'io-ts-reporters'

import { isQuery } from './data-source-helper'
import { Environment } from '~/internals/environment'
import {
  createGoogleSpreadsheetApiModel,
  createSerloModel,
  createChatModel,
} from '~/model'
import { createMailchimpModel } from '~/model/mailchimp'

export class ModelDataSource extends RESTDataSource {
  public googleSpreadsheetApi: ReturnType<
    typeof createGoogleSpreadsheetApiModel
  >
  public serlo: ReturnType<typeof createSerloModel>
  public chat: ReturnType<typeof createChatModel>
  public mailchimp: ReturnType<typeof createMailchimpModel>

  constructor(private environment: Environment) {
    super()

    this.chat = createChatModel({ environment })
    this.serlo = createSerloModel({ environment })
    this.googleSpreadsheetApi = createGoogleSpreadsheetApiModel({ environment })
    this.mailchimp = createMailchimpModel()
  }

  public async removeCacheValue({ key }: { key: string }) {
    await this.environment.cache.remove({ key })
  }

  public async setCacheValue({ key, value }: { key: string; value: unknown }) {
    // TODO: The following code is also used in the SWR queue / worker
    // Both codes should be merged together
    for (const model of [this.serlo, this.googleSpreadsheetApi]) {
      for (const query of Object.values(model)) {
        if (
          isQuery(query) &&
          O.isSome(query._querySpec.getPayload(key)) &&
          query._querySpec.decoder !== undefined
        ) {
          const decoded = query._querySpec.decoder.decode(value)

          if (E.isLeft(decoded)) {
            throw new InvalidValueFromListener({
              key,
              invalidValueFromListener: value,
              decoder: query._querySpec.decoder.name,
              validationErrors: reporter.report(decoded),
            })
          }
        }
      }
    }

    await this.environment.cache.set({
      key,
      value,
      source: 'Legacy serlo.org listener',
    })
  }

  public async updateCacheValue({ key }: { key: string }) {
    await this.environment.swrQueue.queue({ key })
  }
}

// TODO: Find a better place for this error (maybe together with InvalidCurrentValueError)
export class InvalidValueFromListener extends Error {
  constructor(
    public errorContext: {
      key: string
      invalidValueFromListener: unknown
      decoder: string
      validationErrors: string[]
    }
  ) {
    super('Invalid value received from listener.')
  }
}
