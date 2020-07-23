import { user } from '.'
import { ThreadPayload, ThreadsPayload } from '../src/graphql/schema'

export const thread: ThreadPayload = {
  id: 1,
  createdAt: '2014-03-01T20:45:56Z',
  updatedAt: '2014-03-01T20:45:56Z',
  title: 'title',
  archived: false,
  trashed: false,
  comments: [
    {
      id: 1,
      content: 'content',
      createdAt: '2014-03-01T20:45:56Z',
      updatedAt: '2014-03-01T20:45:56Z',
      authorId: user.id,
    },
  ],
  objectId: user.id,
}

export const threads: ThreadsPayload = {
  threadIds: [1],
  objectId: user.id,
}
