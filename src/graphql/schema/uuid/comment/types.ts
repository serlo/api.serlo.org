import { Scalars } from '../../../../types'
import { Resolver } from '../../types'
import { DiscriminatorType } from '../abstract-uuid'
import { UserPayload } from '../user'

export interface CommentPayload {
  id: number
  trashed: boolean
  alias: null
  __typename: DiscriminatorType.Comment
  authorId: number
  title: string
  date: string
  archived: boolean
  content: string
  parentId: number
  childrenIds: number[]
}

export interface CommentResolvers {
  Comment: {
    createdAt: Resolver<CommentPayload, never, Scalars['DateTime']>
    author: Resolver<CommentPayload, never, UserPayload | null>
  }
}
