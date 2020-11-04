import { Scalars, ThreadCommentsArgs } from '../../../types'
import { Connection } from '../connection'
import { Resolver } from '../types'
import { DiscriminatorType, UuidPayload } from '../uuid'
import { CommentPayload } from '../uuid/comment/types'

export interface ThreadsPayload {
  firstCommentIds: number[]
}

export interface ThreadPayload {
  __typename: DiscriminatorType.Thread
  commentPayloads: CommentPayload[]
}

export interface ThreadResolvers {
  Thread: {
    createdAt: Resolver<ThreadPayload, never, Scalars['DateTime']>
    updatedAt: Resolver<ThreadPayload, never, Scalars['DateTime']>
    title: Resolver<ThreadPayload, never, string>
    archived: Resolver<ThreadPayload, never, boolean>
    trashed: Resolver<ThreadPayload, never, boolean>
    object: Resolver<ThreadPayload, never, UuidPayload>
    comments: Resolver<
      ThreadPayload,
      ThreadCommentsArgs,
      Connection<CommentPayload>
    >
  }
}
