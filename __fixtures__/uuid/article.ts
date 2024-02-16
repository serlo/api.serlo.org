import { user } from './user'
import { licenseId } from '../license-id'
import { Model } from '~/internals/graphql'
import {
  castToAlias,
  castToNonEmptyString,
  castToUuid,
  EntityRevisionType,
  EntityType,
} from '~/model/decoder'
import { Instance } from '~/types'

export const article: Model<'Article'> = {
  __typename: EntityType.Article,
  id: castToUuid(1855),
  trashed: false,
  instance: Instance.De,
  alias: castToAlias('/mathe/1855/parabel'),
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: castToUuid(30674),
  licenseId,
  taxonomyTermIds: [5].map(castToUuid),
  revisionIds: [30674].map(castToUuid),
  canonicalSubjectId: castToUuid(5),
}

export const article2: Model<'Article'> = {
  __typename: EntityType.Article,
  id: castToUuid(1495),
  trashed: false,
  instance: Instance.De,
  alias: castToAlias('/mathe/1495/addition'),
  date: '2014-03-01T20:36:44Z',
  currentRevisionId: castToUuid(32614),
  licenseId,
  taxonomyTermIds: [17744].map(castToUuid),
  revisionIds: [32614].map(castToUuid),
  canonicalSubjectId: castToUuid(17744),
}

export const articleRevision: Model<'ArticleRevision'> = {
  __typename: EntityRevisionType.ArticleRevision,
  id: castToUuid(30674),
  trashed: false,
  alias: castToAlias('/mathe/30674/parabel'),
  date: '2014-09-15T15:28:35Z',
  authorId: user.id,
  repositoryId: article.id,
  title: 'title',
  content: castToNonEmptyString('content'),
  changes: 'changes',
  metaDescription: 'metaDescription',
  metaTitle: 'metaTitle',
}

export const articleRevision2: Model<'ArticleRevision'> = {
  __typename: EntityRevisionType.ArticleRevision,
  id: castToUuid(30672),
  trashed: false,
  alias: castToAlias('/mathe/30672/parabel'),
  date: '2014-03-01 20:45:56Z',
  authorId: user.id,
  repositoryId: article.id,
  title: 'title',
  content: castToNonEmptyString('content'),
  changes: 'changes',
  metaDescription: 'metaDescription',
  metaTitle: 'metaTitle',
}
