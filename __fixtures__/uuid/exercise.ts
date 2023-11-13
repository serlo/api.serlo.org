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

export const exercise: Model<'Exercise'> = {
  __typename: EntityType.Exercise,
  id: castToUuid(29637),
  trashed: false,
  instance: Instance.De,
  alias: castToAlias('/mathe/29637/29637'),
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: castToUuid(29638),
  revisionIds: [29638].map(castToUuid),
  licenseId: license.id,
  taxonomyTermIds: [5].map(castToUuid),
  canonicalSubjectId: castToUuid(5),
}

export const exerciseRevision: Model<'ExerciseRevision'> = {
  __typename: EntityRevisionType.ExerciseRevision,
  id: castToUuid(29638),
  trashed: false,
  alias: castToAlias('/mathe/29638/29638'),
  date: '2014-09-15T15:28:35Z',
  authorId: user.id,
  repositoryId: exercise.id,
  content: castToNonEmptyString('content'),
  changes: 'changes',
}
