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

export const course: Model<'Course'> = {
  __typename: EntityType.Course,
  id: castToUuid(18514),
  trashed: false,
  instance: Instance.De,
  alias: castToAlias('/mathe/18514/überblick-zum-satz-des-pythagoras'),
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: castToUuid(30713),
  revisionIds: [30713].map(castToUuid),
  licenseId,
  taxonomyTermIds: [5].map(castToUuid),
  pageIds: [18521].map(castToUuid),
  canonicalSubjectId: castToUuid(5),
}

export const courseRevision: Model<'CourseRevision'> = {
  __typename: EntityRevisionType.CourseRevision,
  id: castToUuid(30713),
  trashed: false,
  alias: castToAlias('/mathe/30713/überblick-zum-satz-des-pythagoras'),
  date: '2014-09-15T15:28:35Z',
  authorId: user.id,
  repositoryId: course.id,
  title: 'title',
  content: castToNonEmptyString('content'),
  changes: 'changes',
  metaDescription: 'metaDescription',
}
