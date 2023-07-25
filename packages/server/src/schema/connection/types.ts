import { GraphQLError } from 'graphql'

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

export class UserInputError extends GraphQLError {
  constructor(message: string, code: string) {
    super(message, {
      extensions: {
        code: code,
      },
    })
  }
}
