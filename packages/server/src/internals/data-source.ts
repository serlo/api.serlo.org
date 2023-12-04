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
}
