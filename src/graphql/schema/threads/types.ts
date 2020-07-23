import { MutationCreateThreadArgs, Comment, Thread } from '../../../types'
import { MutationResolver, Resolver } from '../types'
import { UserPreResolver, UuidPreResolver } from '../uuid'

export interface CommentPreResolver
  extends Omit<Comment, keyof ThreadsResolvers['Comment']> {
  authorId: number
}

export type CommentPayload = CommentPreResolver

export interface ThreadPreResolver extends Omit<Thread, 'comments' | 'object'> {
  // TODO: should be a connection
  comments: CommentPreResolver[]
  objectId: number
}

export type ThreadPayload = ThreadPreResolver

export interface ThreadsPayload {
  threadIds: number[]
  objectId: number
}

export interface ThreadsResolvers {
  Comment: {
    author: Resolver<CommentPreResolver, never, Partial<UserPreResolver>>
  }
  Thread: {
    object: Resolver<ThreadPreResolver, never, UuidPreResolver>
    comments: Resolver<
      ThreadPreResolver,
      never,
      {
        totalCount: number
        nodes: CommentPreResolver[]
      }
    >
  }
  Mutation: {
    createThread: MutationResolver<MutationCreateThreadArgs, ThreadPreResolver>
  }
}
