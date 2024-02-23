import { article, article2 } from './article'
import { user, user2 } from './user'
import { Model } from '~/internals/graphql'
import { castToAlias, castToUuid, DiscriminatorType } from '~/model/decoder'

export const comment: Model<'Comment'> = {
  id: castToUuid(27778),
  trashed: false,
  alias: castToAlias('/mathe/27778/applets-vertauscht'),
  __typename: DiscriminatorType.Comment,
  authorId: user.id,
  title: 'Applets vertauscht?',
  date: '2014-08-25T12:51:02+02:00',
  archived: false,
  content:
    'Ich glaube die Applets zur allgemeinen und Scheitelpunktform müssen die Plätze tauschen ;)',
  parentId: article.id,
  childrenIds: [],
  status: 'open',
}

export const comment1: Model<'Comment'> = {
  id: castToUuid(41443),
  trashed: false,
  alias: castToAlias('/mathe/41443/related-content-ist-chaotisch'),
  __typename: DiscriminatorType.Comment,
  authorId: user.id,
  parentId: article.id,
  title: 'related content ist chaotisch',
  date: '2015-07-07T09:00:31+02:00',
  archived: false,
  content:
    'Die Überschriften sind verschoben, der letzte Link führt zu den Aufgaben. Ich würde auch alle verlinkten Artikel aus dem related content schmeißen. Der related content sollte laut Richtlinien nur genutzt werden, wenn ein Artikel in mehrere aufgeteilt wurde bzw. wenn der Nutzer wahrscheinlich ständig zwischen den Artikel springen muss.\r\n\r\nWas denkt ihr?\r\n\r\nLiebe Grüße,\r\nSimon',
  childrenIds: [49237].map(castToUuid),
  status: 'done',
}

export const comment2: Model<'Comment'> = {
  id: castToUuid(49237),
  trashed: false,
  alias: castToAlias('/mathe/49237/related-content'),
  __typename: DiscriminatorType.Comment,
  authorId: user2.id,
  parentId: comment1.id,
  title: 'related content aufräumen',
  date: '2015-07-08T09:00:31+02:00',
  archived: false,
  content:
    'Ich stimme zu, der related Content ist chaotisch. Ich schlage vor, den related content zu ordnen und gegebenenfalls auch zu löschen wie vorgeschlagen',
  childrenIds: [],
  status: 'noStatus',
}

export const comment3: Model<'Comment'> = {
  id: castToUuid(27144),
  trashed: false,
  alias: castToAlias('/mathe/27144/feedback-zu-dem-artikel-über-das-formular'),
  __typename: DiscriminatorType.Comment,
  authorId: 10,
  title: 'Feedback zu dem Artikel über das Formular',
  date: '2014-08-09T12:33:47+02:00',
  archived: false,
  content:
    'Das obere Beispiel ist "ungut". Denn man hat da Kettenrechnungen hintereinander gestellt und mehrere Gleichzeitszeichen in einer Zeile, aber am Anfang ist die Rechnung 1+2 und am Ende ist die Lösung 6. Mathematisch ist das eine falsche Schreibweise, auch wenn man üblicherweise so rechnet. Bei der zweiten Variante ist das besser gelöst, denn da wird diese Nebenrechnung nicht in die Zeile der Endlösung reingeschrieben.',
  parentId: article2.id,
  childrenIds: [],
  status: 'open',
}
