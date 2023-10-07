import { createChatModel } from './chat'
import { createGoogleSpreadsheetApiModel } from './google-spreadsheet-api'
import { createMailchimpModel } from './mailchimp'
import { createSerloModel } from './serlo'

export * from './chat'
export * from './google-spreadsheet-api'
export * from './serlo'
export * as DatabaseLayer from './database-layer'

export const modelFactories = {
  chat: createChatModel,
  googleSpreadsheetApi: createGoogleSpreadsheetApiModel,
  mailChimp: createMailchimpModel,
  serlo: createSerloModel,
}
