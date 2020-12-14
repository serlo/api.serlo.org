import { RESTDataSource } from 'apollo-datasource-rest'

import { createGoogleSpreadsheetApiModel, createSerloModel } from '../../model'
import { Environment } from '../environment'

export class ModelDataSource extends RESTDataSource {
  public googleSpreadsheetApi: ReturnType<
    typeof createGoogleSpreadsheetApiModel
  >
  public serlo: ReturnType<typeof createSerloModel>

  constructor(private environment: Environment) {
    super()
    const args = {
      environment,
      fetchHelpers: {
        get: this.get.bind(this),
        post: this.post.bind(this),
        patch: this.patch.bind(this),
        put: this.put.bind(this),
        delete: this.delete.bind(this),
      },
    }
    this.serlo = createSerloModel(args)
    this.googleSpreadsheetApi = createGoogleSpreadsheetApiModel(args)
  }

  public async updateCacheValue({ key }: { key: string }) {
    await this.environment.swrQueue.queue({ key })
  }
}
