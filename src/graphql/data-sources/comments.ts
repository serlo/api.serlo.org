import { RESTDataSource } from 'apollo-datasource-rest'

import { Environment } from '../environment'
import { CommentPayload, ThreadPayload } from '../schema/thread/schema'

export class CommentsDataSource extends RESTDataSource {
  public constructor(private environment: Environment) {
    super()
  }

  public getComment(id: string): Promise<CommentPayload> {
    return this.cacheAwareGet({ path: `/comment/${id}` })
  }

  public getThread(id: string): Promise<ThreadPayload> {
    return this.cacheAwareGet({ path: `/thread/${id}` })
  }

  public getThreads(id: number): Promise<string[]> {
    return this.cacheAwareGet({ path: `/threads/${id}` })
  }

  private async cacheAwareGet({ path }: { path: string }) {
    const data = await (process.env.NODE_ENV === 'test'
      ? super.get(`http://localhost:9010${path}`)
      : null) // TODO:
    return data
  }
}
