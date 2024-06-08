import { licenseId } from '../license-id'
import { Model } from '~/internals/graphql'
import {
  castToNonEmptyString,
  EntityRevisionType,
  EntityType,
} from '~/model/decoder'
import { Instance } from '~/types'

export const video: Model<'Video'> = {
  __typename: EntityType.Video,
  id: 32321,
  trashed: false,
  instance: Instance.De,
  alias: '/mathe/32321/schriftliche-addition',
  date: '2014-10-15T12:49:12.000Z',
  currentRevisionId: 32322,
  revisionIds: [32322],
  licenseId,
  taxonomyTermIds: [1292],
  canonicalSubjectId: 5,
}

export const videoRevision: Model<'VideoRevision'> = {
  __typename: EntityRevisionType.VideoRevision,
  id: 32322,
  trashed: false,
  alias: '/entity/repository/compare/32321/32322',
  date: '2014-10-15T12:49:53+02:00',
  authorId: 27689,
  repositoryId: video.id,
  title: 'Schriftliche Addition',
  content: castToNonEmptyString(
    '{"plugin":"rows","state":[{"plugin":"text","state":[{"type":"p","children":[{"text":"Dieses Video erklärt die Schriftliche Addition mit Hilfe einer Stellenwerttafel."}]}]}]}',
  ),
  url: 'https://www.youtube.com/watch?v=-6eCtIUkgmQ',
  changes: '',
}
