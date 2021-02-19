/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */

import { article } from './article'
import { user, user2 } from './user'
import { CommentPayload } from '~/schema/thread/types'
import { DiscriminatorType } from '~/schema/uuid/abstract-uuid/types'
import { UnsupportedComment, UnsupportedThread } from '~/types'

export const comment: CommentPayload = {
  id: 27778,
  trashed: false,
  alias: '/mathe/27778/applets-vertauscht',
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
  alias: '/mathe/41443/related-content-ist-chaotisch',
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
  alias: '/mathe/49237/related-content',
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
  id: 27144,
  trashed: false,
  alias: '/mathe/27144/feedback-zu-dem-artikel-über-das-formular',
  __typename: DiscriminatorType.Comment,
  authorId: 10,
  title: 'Feedback zu dem Artikel über das Formular',
  date: '2014-08-09T12:33:47+02:00',
  archived: false,
  content:
    'Das obere Beispiel ist "ungut". Denn man hat da Kettenrechnungen hintereinander gestellt und mehrere Gleichzeitszeichen in einer Zeile, aber am Anfang ist die Rechnung 1+2 und am Ende ist die Lösung 6. Mathematisch ist das eine falsche Schreibweise, auch wenn man üblicherweise so rechnet. Bei der zweiten Variante ist das besser gelöst, denn da wird diese Nebenrechnung nicht in die Zeile der Endlösung reingeschrieben.',
  parentId: 1495,
  childrenIds: [],
}

export const unsupportedThread: UnsupportedThread = {
  id: 15468,
}

export const unsupportedComment: UnsupportedComment = {
  id: 15469,
}
