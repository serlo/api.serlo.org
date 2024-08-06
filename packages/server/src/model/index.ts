import { createChatModel } from './chat'
import { createGoogleSpreadsheetApiModel } from './google-spreadsheet-api'
import { createKratosModel } from './kratos'
import { createMailchimpModel } from './mailchimp'

export * from './chat'
export * from './google-spreadsheet-api'

export const modelFactories = {
  chat: createChatModel,
  googleSpreadsheetApi: createGoogleSpreadsheetApiModel,
  mailChimp: createMailchimpModel,
  kratos: createKratosModel,
}
