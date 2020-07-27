import * as R from 'ramda'

import {
  EntityRevisionType,
  EntityType,
  VideoPayload,
  VideoRevisionPayload,
} from '../../src/graphql/schema'
import { Instance } from '../../src/types'
import { license } from '../license'

export const video: VideoPayload = {
  __typename: EntityType.Video,
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

export const videoRevision: VideoRevisionPayload = {
  __typename: EntityRevisionType.VideoRevision,
  id: 16114,
  trashed: false,
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: video.id,
  title: 'title',
  content: 'content',
  url: 'url',
  changes: 'changes',
}

export function getVideoDataWithoutSubResolvers(video: VideoPayload) {
  return R.omit(['currentRevisionId', 'licenseId', 'taxonomyTermIds'], video)
}

export function getVideoRevisionDataWithoutSubResolvers(
  videoRevision: VideoRevisionPayload
) {
  return R.omit(['authorId', 'repositoryId'], videoRevision)
}
