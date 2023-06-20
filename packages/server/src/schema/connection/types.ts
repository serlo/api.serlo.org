import { Maybe, Scalars, PageInfo } from '../../types'

export interface Connection<T> {
  edges: Array<{ node: T; cursor: string }>
  nodes: T[]
  totalCount: number
  pageInfo: PageInfo
}

export interface ConnectionPayload {
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
}
