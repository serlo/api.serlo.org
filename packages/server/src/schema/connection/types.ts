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

interface PageInfo {
  endCursor?: string | null
  hasNextPage: boolean
}
