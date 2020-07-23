import { QueryThreadsResult } from '../../../types'
import { resolveConnection, ConnectionPayload } from '../connection'
import { Resolver } from '../types'
import { UuidPreResolver } from '../uuid'
import { ThreadPreResolver } from './types'

export type ThreadsResolver<T extends UuidPreResolver> = Resolver<
  T,
  ConnectionPayload,
  QueryThreadsResultPreResolver
>

export interface QueryThreadsResultPreResolver
  extends Omit<QueryThreadsResult, 'nodes' | 'edges'> {
  nodes: ThreadPreResolver[]
  edges: {
    cursor: string
    node: ThreadPreResolver
  }[]
}

export function createThreadsResolver<
  T extends UuidPreResolver
>(): ThreadsResolver<T> {
  return async function threads(object, payload, { dataSources }) {
    const data = await dataSources.serlo.getThreads({ id: object.id })
    const threads = await Promise.all(
      data.threadIds.map((id) => {
        return dataSources.serlo.getThread({ id })
      })
    )
    return resolveConnection<ThreadPreResolver>({
      nodes: threads,
      payload,
      createCursor(thread) {
        return thread.id.toString()
      },
    })
  }
}
