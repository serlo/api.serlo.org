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
import { createKratosModel } from '~/model/kratos'
import { createMailchimpModel } from '~/model/mailchimp'

export class ModelDataSource extends RESTDataSource {
  public googleSpreadsheetApi: ReturnType<
    typeof createGoogleSpreadsheetApiModel
  >
  public serlo: ReturnType<typeof createSerloModel>
  public chat: ReturnType<typeof createChatModel>
  public mailchimp: ReturnType<typeof createMailchimpModel>
  public kratos: ReturnType<typeof createKratosModel>
  public authServices: Environment['authServices']

  constructor(private environment: Environment) {
    super()

    this.chat = createChatModel({ environment })
    this.serlo = createSerloModel({ environment })
    this.googleSpreadsheetApi = createGoogleSpreadsheetApiModel({ environment })
    this.mailchimp = createMailchimpModel()
    this.kratos = createKratosModel({ environment })
    this.authServices = environment.authServices
  }

  public async removeCacheValue({ keys }: { keys: string[] }) {
    for (const key of keys) {
      await this.environment.cache.remove({ key })
    }
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
