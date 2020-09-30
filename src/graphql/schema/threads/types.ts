import { Scalars, Thread, ThreadCommentsArgs } from '../../../types'
import { Connection } from '../connection'
import { Resolver } from '../types'
import { DiscriminatorType, UuidPayload } from '../uuid'
import { CommentPayload } from '../uuid/comment/types'

export interface ThreadsPayload {
  threadIds: number[]
  objectId: number // This is also a Uuid
}

export interface ThreadPayload extends Omit<Thread, 'comments' | 'object'> {
  __typename: DiscriminatorType.Thread
  comments: CommentPayload[]
  objectId: number
}

export interface ThreadResolvers {
  Thread: {
    object: Resolver<ThreadPayload, never, UuidPayload | null>
    comments: Resolver<
      ThreadPayload,
      ThreadCommentsArgs,
      Connection<CommentPayload>
    >
    createdAt: Resolver<ThreadPayload, never, Scalars['DateTime']>
    updatedAt: Resolver<ThreadPayload, never, Scalars['DateTime']>
    title: Resolver<ThreadPayload, never, string>
  }
  // TODO: Mutation ergänzen
  /*
  Mutation: {
    createThread: MutationResolver<MutationCreateThreadArgs, ThreadPayload>
  }
   */
}
