import { RESTDataSource } from 'apollo-datasource-rest'

import { createSerloModel } from '../../model/serlo'
import { Environment } from '../environment'

export class ModelDataSource extends RESTDataSource {
  public serlo: ReturnType<typeof createSerloModel>

  constructor(private environment: Environment) {
    super()
    this.serlo = createSerloModel({
      environment,
      fetchHelpers: {
        get: this.get.bind(this),
        post: this.post.bind(this),
        patch: this.patch.bind(this),
        put: this.put.bind(this),
        delete: this.delete.bind(this),
      },
    })
  }
}
