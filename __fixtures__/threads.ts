import {
  CommentPayload,
  ThreadPayload,
} from '../src/graphql/schema/thread/schema'
import { user } from './uuid'

export const comment: CommentPayload = {
  id: 'comment-id',
  authorId: user.id,
  content: 'content',
  createdAt: '2014-03-01T20:45:56Z',
  updatedAt: '2014-03-01T20:45:56Z',
}

export const thread: Omit<ThreadPayload, 'parentId'> = {
  id: 'id',
  title: 'title',
  updatedAt: '2014-03-01T20:45:56Z',
  createdAt: '2014-03-01T20:45:56Z',
  archived: false,
  commentIds: [comment.id],
}

export const threads: string[] = [thread.id]
