import { RESTDataSource } from 'apollo-datasource-rest'

import { Environment } from '../environment'
import { UuidPayload, UuidType } from '../schema/uuid'

export class UuidDataSource extends RESTDataSource {
  public constructor(private environment: Environment) {
    super()
  }

  public getUuid(id: string): Promise<UuidPayload & { type: UuidType }> {
    return this.cacheAwareGet({ path: `/uuid/${id}` })
  }

  private async cacheAwareGet({ path }: { path: string }) {
    const data = await (process.env.NODE_ENV === 'test'
      ? super.get(`http://localhost:9011${path}`)
      : null) // TODO:
    return data
  }
}
