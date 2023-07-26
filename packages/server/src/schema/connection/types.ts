import { PageInfo } from '../../types'

export interface Connection<T> {
  edges: Array<{ node: T; cursor: string }>
  nodes: T[]
  totalCount: number
  pageInfo: PageInfo
}

export interface ConnectionPayload {
  after?: string
  before?: string
  first?: number
  last?: number
}
