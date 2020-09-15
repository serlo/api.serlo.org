import { user } from '.'
import { DiscriminatorType, ThreadsPayload } from '../src/graphql/schema'
import { ThreadPayload } from '../src/graphql/schema/uuid/thread/types'

// TODO: Hier muss die wirkliche Serverantwort stehen (kein Thread!)
export const thread: ThreadPayload = {
  id: 1,
  __typename: DiscriminatorType.Thread,
  createdAt: '2014-03-01T20:45:56Z',
  updatedAt: '2014-03-01T20:45:56Z',
  title: 'title',
  archived: false,
  trashed: false,
  comments: [
    {
      id: 41443,
      trashed: false,
      alias: null,
      __typename: 'Comment',
      authorId: 10,
      title: 'related content ist chaotisch',
      date: '2015-07-07T09:00:31+02:00',
      archived: false,
      content:
        'Die Überschriften sind verschoben, der letzte Link führt zu den Aufgaben. Ich würde auch alle verlinkten Artikel aus dem related content schmeißen. Der related content sollte laut Richtlinien nur genutzt werden, wenn ein Artikel in mehrere aufgeteilt wurde bzw. wenn der Nutzer wahrscheinlich ständig zwischen den Artikel springen muss.\r\n\r\nWas denkt ihr?\r\n\r\nLiebe Grüße,\r\nSimon',
      childrenIds: [49237],
    },
  ],
  objectId: user.id,
}

export const threads: ThreadsPayload = {
  threadIds: [1],
  objectId: user.id,
}
