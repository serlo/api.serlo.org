import { user } from './user'
import { licenseId } from '../license-id'
import { Model } from '~/internals/graphql'
import {
  EntityType,
  EntityRevisionType,
  castToNonEmptyString,
} from '~/model/decoder'
import { Instance } from '~/types'

export const page: Model<'Page'> = {
  __typename: EntityType.Page,
  id: 19767,
  trashed: false,
  instance: Instance.De,
  alias: '/19767/mathematik-startseite',
  date: '2015-02-28T02:06:40Z',
  currentRevisionId: 35476,
  revisionIds: [35476],
  canonicalSubjectId: 123, // TODO: I think creating an extra subject for all meta/commuity-pages might make sense?
  licenseId,
}

export const pageRevision: Model<'PageRevision'> = {
  __typename: EntityRevisionType.PageRevision,
  id: 35476,
  trashed: false,
  alias: '/entity/repository/compare/0/35476',
  title: 'title',
  content: castToNonEmptyString('content'),
  changes: 'typo',
  date: '2015-02-28T02:06:40Z',
  authorId: user.id,
  repositoryId: page.id,
}

export const pageRevision2: Model<'PageRevision'> = {
  __typename: EntityRevisionType.PageRevision,
  id: 33220,
  trashed: false,
  alias: '/entity/repository/compare/0/33220',
  title: 'title',
  content: castToNonEmptyString('content'),
  changes: 'fix link',
  date: '2014-11-26 15:08:48Z',
  authorId: user.id,
  repositoryId: page.id,
}
