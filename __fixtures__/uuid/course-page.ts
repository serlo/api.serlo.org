import { course } from './course'
import { user } from './user'
import { licenseId } from '../license-id'
import { Model } from '~/internals/graphql'
import {
  castToNonEmptyString,
  EntityRevisionType,
  EntityType,
} from '~/model/decoder'
import { Instance } from '~/types'

export const coursePage: Model<'CoursePage'> = {
  __typename: EntityType.CoursePage,
  id: 18521,
  trashed: false,
  instance: Instance.De,
  alias: '/mathe/18521/startseite',
  date: '2014-03-17T12:24:54.000Z',
  currentRevisionId: 19277,
  revisionIds: [19277],
  licenseId,
  parentId: course.id,
  canonicalSubjectId: 5,
}

export const coursePageRevision: Model<'CoursePageRevision'> = {
  __typename: EntityRevisionType.CoursePageRevision,
  id: 19277,
  trashed: false,
  alias: '/mathe/19277/startseite',
  date: '2014-09-15T15:28:35Z',
  authorId: user.id,
  repositoryId: coursePage.id,
  title: 'title',
  content: castToNonEmptyString('content'),
  changes: 'changes',
}
