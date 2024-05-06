import { user } from './user'
import { licenseId } from '../license-id'
import { Model } from '~/internals/graphql'
import {
  castToNonEmptyString,
  EntityRevisionType,
  EntityType,
} from '~/model/decoder'
import { Instance } from '~/types'

// Here we use the type `ArticleWithAllFieldsDefined` so that TypeScript knows
// that no property of `article` is null
export const article: ArticleWithAllFieldsDefined = {
  __typename: EntityType.Article,
  id: 1855,
  trashed: false,
  instance: Instance.De,
  alias: '/mathe/1855/parabel',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 30674,
  licenseId,
  taxonomyTermIds: [5],
  revisionIds: [30674],
  canonicalSubjectId: 5,
}

export const article2: Model<'Article'> = {
  __typename: EntityType.Article,
  id: 1495,
  trashed: false,
  instance: Instance.De,
  alias: '/mathe/1495/addition',
  date: '2014-03-01T20:36:44Z',
  currentRevisionId: 32614,
  licenseId,
  taxonomyTermIds: [17744],
  revisionIds: [32614],
  canonicalSubjectId: 17744,
}

export const articleRevision: Model<'ArticleRevision'> = {
  __typename: EntityRevisionType.ArticleRevision,
  id: 30674,
  trashed: false,
  alias: '/mathe/30674/parabel',
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
  id: 30672,
  trashed: false,
  alias: '/mathe/30672/parabel',
  date: '2014-03-01 20:45:56Z',
  authorId: user.id,
  repositoryId: article.id,
  title: 'title',
  content: castToNonEmptyString('content'),
  changes: 'changes',
  metaDescription: 'metaDescription',
  metaTitle: 'metaTitle',
}

interface ArticleWithAllFieldsDefined extends Model<'Article'> {
  canonicalSubjectId: number
  currentRevisionId: number
}
