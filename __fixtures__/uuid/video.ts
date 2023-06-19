import { user } from './user'
import { license } from '../license'
import { Model } from '~/internals/graphql'
import {
  castToAlias,
  castToNonEmptyString,
  castToUuid,
  EntityRevisionType,
  EntityType,
} from '~/model/decoder'
import { Instance } from '~/types'

export const video: Model<'Video'> = {
  __typename: EntityType.Video,
  id: castToUuid(16078),
  trashed: false,
  instance: Instance.De,
  alias: castToAlias('/mathe/16078/waagrechte-und-schiefe-asymptote'),
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: castToUuid(16114),
  revisionIds: [16114].map(castToUuid),
  licenseId: license.id,
  taxonomyTermIds: [5].map(castToUuid),
  canonicalSubjectId: castToUuid(5),
}

export const videoRevision: Model<'VideoRevision'> = {
  __typename: EntityRevisionType.VideoRevision,
  id: castToUuid(16114),
  trashed: false,
  alias: castToAlias('/mathe/16114/waagrechte-und-schiefe-asymptote'),
  date: '2014-09-15T15:28:35Z',
  authorId: user.id,
  repositoryId: video.id,
  title: 'title',
  content: castToNonEmptyString('content'),
  url: 'url',
  changes: 'changes',
}
