import { MutationCreateThreadArgs, Comment, Thread } from '../../../types'
import { MutationResolver, Resolver } from '../types'
import { UserPreResolver } from '../uuid'

export interface CommentPreResolver
  extends Omit<Comment, keyof ThreadsResolvers['Comment']> {
  authorId: number
}

export type CommentPayload = CommentPreResolver

export interface ThreadPreResolver extends Omit<Thread, 'comments' | 'object'> {
  // TODO: should be a connection
  comments: {
    totalCount: number
    nodes: CommentPreResolver[]
  }
  objectId: number
}

export interface ThreadPayload extends Omit<Thread, 'comments' | 'object'> {
  comments: CommentPreResolver[]
  objectId: number
}

export interface ThreadsPayload {
  threadIds: number[]
  objectId: number
}

export interface ThreadsResolvers {
  Comment: {
    author: Resolver<CommentPreResolver, never, Partial<UserPreResolver>>
  }
  Mutation: {
    createThread: MutationResolver<MutationCreateThreadArgs>
  }
}
