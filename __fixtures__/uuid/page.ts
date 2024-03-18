import { user } from './user'
import { licenseId } from '../license-id'
import { Model } from '~/internals/graphql'
import { castToAlias, castToUuid, DiscriminatorType } from '~/model/decoder'
import { Instance } from '~/types'

export const page: Model<'Page'> = {
  __typename: DiscriminatorType.Page,
  id: castToUuid(19767),
  trashed: false,
  instance: Instance.De,
  alias: castToAlias('/19767/mathematik-startseite'),
  date: '2015-02-28T02:06:40Z',
  currentRevisionId: castToUuid(35476),
  revisionIds: [35476].map(castToUuid),
  licenseId,
}

export const pageRevision: Model<'PageRevision'> = {
  __typename: DiscriminatorType.PageRevision,
  id: castToUuid(35476),
  trashed: false,
  alias: castToAlias('/entity/repository/compare/0/35476'),
  title: 'title',
  content: 'content',
  date: '2015-02-28T02:06:40Z',
  authorId: user.id,
  repositoryId: page.id,
}

export const pageRevision2: Model<'PageRevision'> = {
  __typename: DiscriminatorType.PageRevision,
  id: castToUuid(33220),
  trashed: false,
  alias: castToAlias('/entity/repository/compare/0/33220'),
  title: 'title',
  content: 'content',
  date: '2014-11-26 15:08:48Z',
  authorId: user.id,
  repositoryId: page.id,
}
