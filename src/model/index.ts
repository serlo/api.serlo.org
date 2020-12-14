import { createGoogleSpreadsheetApiModel } from './google-spreadsheet-api'
import { createSerloModel } from './serlo'

export * from './google-spreadsheet-api'
export * from './serlo'

export const models = {
  googleSpreadsheetApi: createGoogleSpreadsheetApiModel,
  serlo: createSerloModel,
}
