import { Scalars } from '../../../../types'
import { Resolver } from '../../types'
import { UserPayload } from '../user'

export interface CommentPayload {
  // Server answer. !Does not coincide with what the query will give back as a comment
  id: number
  trashed: boolean
  alias: null
  __typename: 'Comment'
  authorId: number
  title: string
  date: string
  archived: boolean
  content: string
  childrenIds: number[]
}

export interface CommentResolvers {
  Comment: {
    createdAt: Resolver<CommentPayload, never, Scalars['DateTime']>
    author: Resolver<CommentPayload, never, UserPayload | null>
  }
}
