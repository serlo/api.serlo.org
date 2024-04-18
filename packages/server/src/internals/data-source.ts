import { RESTDataSource } from 'apollo-datasource-rest'

import { Context } from '~/context'
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

  constructor(context: Pick<Context, 'swrQueue' | 'cache' | 'authServices'>) {
    super()

    this.chat = createChatModel({ context })
    this.serlo = createSerloModel({ context })
    this.googleSpreadsheetApi = createGoogleSpreadsheetApiModel({ context })
    this.mailchimp = createMailchimpModel()
    this.kratos = createKratosModel({ context })
  }
}
