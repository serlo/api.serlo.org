import { user } from './user'
import { licenseId } from '../license-id'
import { Model } from '~/internals/graphql'
import {
  castToNonEmptyString,
  EntityRevisionType,
  EntityType,
} from '~/model/decoder'
import { Instance } from '~/types'

export const course: Model<'Course'> = {
  __typename: EntityType.Course,
  id: 18514,
  trashed: false,
  instance: Instance.De,
  alias: '/mathe/18514/überblick-zum-satz-des-pythagoras',
  date: '2014-03-17T12:22:17.000Z',
  currentRevisionId: 30713,
  revisionIds: [30713],
  licenseId,
  taxonomyTermIds: [5],
  pageIds: [18521],
  canonicalSubjectId: 5,
}

export const courseRevision: Model<'CourseRevision'> = {
  __typename: EntityRevisionType.CourseRevision,
  id: 30713,
  trashed: false,
  alias: '/mathe/30713/überblick-zum-satz-des-pythagoras',
  date: '2014-09-15T15:28:35Z',
  authorId: user.id,
  repositoryId: course.id,
  title: 'title',
  content: castToNonEmptyString('content'),
  changes: 'changes',
  metaDescription: 'metaDescription',
}
