import { course } from './course'
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

export const coursePage: Model<'CoursePage'> = {
  __typename: EntityType.CoursePage,
  id: castToUuid(18521),
  trashed: false,
  instance: Instance.De,
  alias: castToAlias('/mathe/18521/startseite'),
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: castToUuid(19277),
  revisionIds: [19277].map(castToUuid),
  licenseId,
  parentId: course.id,
  canonicalSubjectId: castToUuid(5),
}

export const coursePageRevision: Model<'CoursePageRevision'> = {
  __typename: EntityRevisionType.CoursePageRevision,
  id: castToUuid(19277),
  trashed: false,
  alias: castToAlias('/mathe/19277/startseite'),
  date: '2014-09-15T15:28:35Z',
  authorId: user.id,
  repositoryId: coursePage.id,
  title: 'title',
  content: castToNonEmptyString('content'),
  changes: 'changes',
}
