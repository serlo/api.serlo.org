import {
  DiscriminatorType,
  ThreadPayload,
  ThreadsPayload,
} from '../src/graphql/schema'
import { comment1, comment2, comment3 } from './uuid/comment'

export const threads: ThreadsPayload = {
  //TODO? threadIds umbenennen
  firstCommentIds: [comment1.id, comment3.id],
}

export const thread1: ThreadPayload = {
  __typename: DiscriminatorType.Thread,
  commentPayloads: [comment1, comment2],
}

export const thread2: ThreadPayload = {
  __typename: DiscriminatorType.Thread,
  commentPayloads: [comment3],
}
