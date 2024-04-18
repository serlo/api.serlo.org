export interface Connection<T> {
  nodes: T[]
  totalCount: number
  pageInfo: PageInfo
}

export interface ConnectionPayload {
  after?: string
  first?: number
}

interface PageInfo {
  endCursor?: string | null
  hasNextPage: boolean
}
