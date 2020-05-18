import { RESTDataSource } from 'apollo-datasource-rest'

import { Environment } from '../environment'

export class CommentsDataSource extends RESTDataSource {
  public constructor(private environment: Environment) {
    super()
  }

  public async getThreads(id: number) {
    const data = await this.cacheAwareGet({ path: `/threads/${id}` })
    return data
  }

  private async cacheAwareGet({ path }: { path: string }) {
    const data = await (process.env.NODE_ENV === 'test'
      ? super.get(`http://localhost:9010${path}`)
      : null) // TODO:
    return data
  }
}
