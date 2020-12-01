/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as R from 'ramda'

import { DiscriminatorType } from '../../src/graphql/schema/uuid/abstract-uuid'
import { CommentPayload } from '../../src/graphql/schema/uuid/thread'
import { UnsupportedComment, UnsupportedThread } from '../../src/types'
import { article } from './article'
import { user, user2 } from './user'

export const comment: CommentPayload = {
  id: 27778,
  trashed: false,
  alias: null,
  __typename: DiscriminatorType.Comment,
  authorId: user.id,
  title: 'Applets vertauscht?',
  date: '2014-08-25T12:51:02+02:00',
  archived: false,
  content:
    'Ich glaube die Applets zur allgemeinen und Scheitelpunktform müssen die Plätze tauschen ;)',
  parentId: article.id,
  childrenIds: [],
}

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

export const comment3: CommentPayload = {
  id: 49238,
  trashed: false,
  alias: null,
  __typename: DiscriminatorType.Comment,
  authorId: user2.id,
  parentId: article.id,
  title: 'Parabeln besser darstellen',
  date: '2020-01-02T09:00:31+02:00',
  archived: false,
  content:
    'Das Parabeldesign ist nicht schön genug, da müssen wir uns noch etwas mehr Mühe geben',
  childrenIds: [],
}

export const unsupportedThread: UnsupportedThread = {
  id: 15468,
}

export const unsupportedComment: UnsupportedComment = {
  id: 15469,
}

export function getCommentDataWithoutSubresolvers(comment: CommentPayload) {
  return R.omit(['alias'], comment)
}
