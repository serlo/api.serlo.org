import { user } from './user'
import { licenseId } from '../license-id'
import { Model } from '~/internals/graphql'
import {
  castToNonEmptyString,
  EntityRevisionType,
  EntityType,
} from '~/model/decoder'
import { Instance } from '~/types'

export const exercise: Model<'Exercise'> = {
  __typename: EntityType.Exercise,
  id: 29637,
  trashed: false,
  instance: Instance.De,
  alias: '/mathe/29637/29637',
  date: '2014-09-08T10:42:33.000Z',
  currentRevisionId: 29638,
  revisionIds: [29638],
  licenseId,
  taxonomyTermIds: [5],
  canonicalSubjectId: 5,
}

export const exerciseRevision: Model<'ExerciseRevision'> = {
  __typename: EntityRevisionType.ExerciseRevision,
  id: 29638,
  trashed: false,
  alias: '/mathe/29638/29638',
  date: '2014-09-15T15:28:35Z',
  authorId: user.id,
  repositoryId: exercise.id,
  content: castToNonEmptyString('content'),
  changes: 'changes',
}
