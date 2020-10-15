import * as R from 'ramda'

import { DiscriminatorType } from '../../src/graphql/schema/uuid/abstract-uuid'
import { CommentPayload } from '../../src/graphql/schema/uuid/comment/types'
import { article } from './article'
import { user, user2 } from './user'

export const comment1: CommentPayload = {
  id: 41443,
  trashed: false,
  alias: null,
  __typename: DiscriminatorType.Comment,
  authorId: user.id,
  parentId: article.id,
  title: 'related content ist chaotisch',
  date: '2015-07-07T09:00:31+02:00',
  archived: false,
  content:
    'Die Überschriften sind verschoben, der letzte Link führt zu den Aufgaben. Ich würde auch alle verlinkten Artikel aus dem related content schmeißen. Der related content sollte laut Richtlinien nur genutzt werden, wenn ein Artikel in mehrere aufgeteilt wurde bzw. wenn der Nutzer wahrscheinlich ständig zwischen den Artikel springen muss.\r\n\r\nWas denkt ihr?\r\n\r\nLiebe Grüße,\r\nSimon',
  childrenIds: [49237],
}

export const comment2: CommentPayload = {
  id: 49237,
  trashed: false,
  alias: null,
  __typename: DiscriminatorType.Comment,
  authorId: user2.id,
  parentId: comment1.id,
  title: 'related content aufräumen',
  date: '2015-07-08T09:00:31+02:00',
  archived: false,
  content:
    'Ich stimme zu, der related Content ist chaotisch. Ich schlage vor, den related content zu ordnen und gegebenenfalls auch zu löschen wie vorgeschlagen',
  childrenIds: [],
}

export function getCommentDataWithoutSubresolvers(comment: CommentPayload) {
  return R.omit(['createdAt', 'author'], comment)
}
