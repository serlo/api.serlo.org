import { ThreadPayload } from '../src/graphql/schema/thread/thread'
import { user } from './uuid'

export const threads: ThreadPayload[] = [
  {
    id: 'id',
    title: 'title',
    updatedAt: '2014-03-01T20:45:56Z',
    createdAt: '2014-03-01T20:45:56Z',
    archived: false,
    trashed: false,
    comments: [
      {
        id: 'comment-id',
        authorId: user.id,
        content: 'content',
        createdAt: '2014-03-01T20:45:56Z',
        updatedAt: '2014-03-01T20:45:56Z',
      },
    ],
  },
]
