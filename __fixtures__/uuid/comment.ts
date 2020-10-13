import { DiscriminatorType } from '../../src/graphql/schema/uuid/abstract-uuid'
import { CommentPayload } from '../../src/graphql/schema/uuid/comment/types'

export const comment: CommentPayload = {
  id: 41443,
  trashed: false,
  alias: null,
  __typename: DiscriminatorType.Comment,
  authorId: 10, // user, der in den Fixture drin ist von user fixtere import
  parentId: 12345, // uuid die existiert
  title: 'related content ist chaotisch',
  date: '2015-07-07T09:00:31+02:00',
  archived: false,
  content:
    'Die Überschriften sind verschoben, der letzte Link führt zu den Aufgaben. Ich würde auch alle verlinkten Artikel aus dem related content schmeißen. Der related content sollte laut Richtlinien nur genutzt werden, wenn ein Artikel in mehrere aufgeteilt wurde bzw. wenn der Nutzer wahrscheinlich ständig zwischen den Artikel springen muss.\r\n\r\nWas denkt ihr?\r\n\r\nLiebe Grüße,\r\nSimon',
  childrenIds: [49237], //entweder leer oder anderer fixture, der darauf verweist
}
