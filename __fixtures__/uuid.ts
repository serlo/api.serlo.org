import { Instance } from '../src/graphql/schema/instance'
import {
  AliasPayload,
  ArticlePayload,
  ArticleRevisionPayload,
  ExerciseGroupPayload,
  ExerciseGroupRevisionPayload,
  ExercisePayload,
  ExerciseRevisionPayload,
  GroupedExercisePayload,
  GroupedExerciseRevisionPayload,
  SolutionPayload,
  SolutionRevisionPayload,
  PagePayload,
  PageRevisionPayload,
  TaxonomyTermPayload,
  TaxonomyTermType,
  UserPayload,
  AppletRevisionPayload,
  AppletPayload,
  EventPayload,
  EventRevisionPayload,
  VideoPayload,
  VideoRevisionPayload,
} from '../src/graphql/schema/uuid'
import { license } from './license'

export const applet: AppletPayload = {
  id: 35596,
  trashed: false,
  instance: Instance.De,
  alias: '/math/example-content/example-topic-1/example-applet',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 35597,
  licenseId: license.id,
  taxonomyTermIds: [5],
}

export const appletAlias: AliasPayload = {
  id: 35596,
  instance: Instance.De,
  path: '/math/example-content/example-topic-1/example-applet',
  source: '/entity/view/35596',
  timestamp: '2014-06-16T15:58:45Z',
}

export const appletRevision: AppletRevisionPayload = {
  id: 35597,
  trashed: false,
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: applet.id,
  url: 'url',
  title: 'title',
  content: 'content',
  changes: 'changes',
}

export const article: ArticlePayload = {
  id: 1855,
  trashed: false,
  instance: Instance.De,
  alias: '/mathe/funktionen/uebersicht-aller-artikel-zu-funktionen/parabel',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 30674,
  licenseId: license.id,
  taxonomyTermIds: [5],
}

export const articleAlias: AliasPayload = {
  id: 1855,
  instance: Instance.De,
  path: '/mathe/funktionen/uebersicht-aller-artikel-zu-funktionen/parabel',
  source: '/entity/view/1855',
  timestamp: '2014-06-16T15:58:45Z',
}

export const articleRevision: ArticleRevisionPayload = {
  id: 30674,
  trashed: false,
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: article.id,
  title: 'title',
  content: 'content',
  changes: 'changes',
}

export const event: EventPayload = {
  id: 35554,
  trashed: false,
  instance: Instance.De,
  alias: '/mathe/beispielinhalte/beispielveranstaltung',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 35555,
  licenseId: license.id,
  taxonomyTermIds: [5],
}

export const eventAlias: AliasPayload = {
  id: 35554,
  instance: Instance.De,
  path: '/mathe/beispielinhalte/beispielveranstaltung',
  source: '/entity/view/35554',
  timestamp: '2014-06-16T15:58:45Z',
}

export const eventRevision: EventRevisionPayload = {
  id: 35555,
  trashed: false,
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: event.id,
  title: 'title',
  content: 'content',
  changes: 'changes',
}

export const pageAlias: AliasPayload = {
  id: 19767,
  instance: Instance.De,
  path: '/mathe',
  source: '/page/view/19767',
  timestamp: '2014-05-25T10:25:44Z',
}

export const page: PagePayload = {
  id: 19767,
  trashed: false,
  instance: Instance.De,
  alias: '/mathe',
  currentRevisionId: 35476,
  licenseId: license.id,
}

export const pageRevision: PageRevisionPayload = {
  id: 35476,
  trashed: false,
  title: 'title',
  content: 'content',
  date: '2015-02-28T02:06:40Z',
  authorId: 1,
  repositoryId: page.id,
}

export const exerciseAlias: AliasPayload = {
  id: 29637,
  instance: Instance.De,
  path: '/29637/29637',
  source: '/entity/view/29637',
  timestamp: '2014-05-25T10:25:44Z',
}

export const exercise: ExercisePayload = {
  id: 29637,
  trashed: false,
  instance: Instance.De,
  alias: '/29637/29637',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 29638,
  licenseId: license.id,
  solutionId: 29648,
  taxonomyTermIds: [5],
}

export const exerciseRevision: ExerciseRevisionPayload = {
  id: 29638,
  trashed: false,
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: exercise.id,
  content: 'content',
  changes: 'changes',
}

export const exerciseGroupAlias: AliasPayload = {
  id: 2217,
  instance: Instance.De,
  path: '/2217/2217',
  source: '/entity/view/2217',
  timestamp: '2014-05-25T10:25:44Z',
}

export const exerciseGroup: ExerciseGroupPayload = {
  id: 2217,
  trashed: false,
  instance: Instance.De,
  alias: '/2217/2217',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 2218,
  licenseId: license.id,
  taxonomyTermIds: [5],
  exerciseIds: [2219],
}

export const exerciseGroupRevision: ExerciseGroupRevisionPayload = {
  id: 2218,
  trashed: false,
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: exerciseGroup.id,
  content: 'content',
  changes: 'changes',
}

export const groupedExerciseAlias: AliasPayload = {
  id: 2219,
  instance: Instance.De,
  path: '/2219/2219',
  source: '/entity/view/2219',
  timestamp: '2014-05-25T10:25:44Z',
}

export const groupedExercise: GroupedExercisePayload = {
  id: 2219,
  trashed: false,
  instance: Instance.De,
  alias: '/2219/2219',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 2220,
  licenseId: license.id,
  solutionId: 29648,
  parentId: exerciseGroup.id,
}

export const groupedExerciseRevision: GroupedExerciseRevisionPayload = {
  id: 2220,
  trashed: false,
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: groupedExercise.id,
  content: 'content',
  changes: 'changes',
}

export const solutionAlias: AliasPayload = {
  id: 29648,
  instance: Instance.De,
  path: '/29648/29648',
  source: '/entity/view/29648',
  timestamp: '2014-05-25T10:25:44Z',
}

export const solution: SolutionPayload = {
  id: 29648,
  trashed: false,
  instance: Instance.De,
  alias: '/29648/29648',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 29652,
  licenseId: license.id,
  parentId: exercise.id,
}

export const solutionRevision: SolutionRevisionPayload = {
  id: 29652,
  trashed: false,
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: solution.id,
  content: 'content',
  changes: 'changes',
}

export const taxonomyTermRoot: TaxonomyTermPayload = {
  id: 3,
  trashed: false,
  alias: null,
  type: TaxonomyTermType.Root,
  instance: Instance.De,
  name: 'name',
  description: null,
  weight: 1,
  parentId: null,
  childrenIds: [5],
}

export const taxonomyTermSubject: TaxonomyTermPayload = {
  id: 5,
  trashed: false,
  alias: 'alias',
  type: TaxonomyTermType.Subject,
  instance: Instance.De,
  name: 'name',
  description: null,
  weight: 2,
  parentId: taxonomyTermRoot.id,
  childrenIds: [16048],
}

export const taxonomyTermCurriculumTopic: TaxonomyTermPayload = {
  id: 16048,
  trashed: false,
  alias: 'alias',
  type: TaxonomyTermType.CurriculumTopic,
  instance: Instance.De,
  name: 'name',
  description: 'description',
  weight: 3,
  parentId: taxonomyTermSubject.id,
  childrenIds: [1855],
}

export const user: UserPayload = {
  id: 1,
  trashed: false,
  username: 'username',
  date: '2014-03-01T20:36:21Z',
  lastLogin: '2020-03-24T09:40:55Z',
  description: null,
}

export const video: VideoPayload = {
  id: 16078,
  trashed: false,
  instance: Instance.De,
  alias:
    '/mathe/artikel-und-videos-aus-serlo1/waagrechte-und-schiefe-asymptote',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 16114,
  licenseId: license.id,
  taxonomyTermIds: [5],
}

export const videoAlias: AliasPayload = {
  id: 16078,
  instance: Instance.De,
  path: '/mathe/artikel-und-videos-aus-serlo1/waagrechte-und-schiefe-asymptote',
  source: '/entity/view/16078',
  timestamp: '2014-06-16T15:58:45Z',
}

export const videoRevision: VideoRevisionPayload = {
  id: 16114,
  trashed: false,
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: video.id,
  title: 'title',
  url: 'url',
  changes: 'changes',
}
