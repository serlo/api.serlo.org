import { exerciseGroup } from './exercise-group'
import { user } from './user'
import { licenseId } from '../license-id'
import { Model } from '~/internals/graphql'
import { Payload } from '~/internals/model'
import {
  castToAlias,
  castToNonEmptyString,
  castToUuid,
  EntityRevisionType,
  EntityType,
} from '~/model/decoder'
import { Instance } from '~/types'

export const groupedExerciseAlias: Payload<'serlo', 'getAlias'> = {
  id: 2219,
  instance: Instance.De,
  path: '/2219/2219',
}

export const groupedExercise: Model<'GroupedExercise'> = {
  __typename: EntityType.GroupedExercise,
  id: castToUuid(2219),
  trashed: false,
  instance: Instance.De,
  alias: castToAlias('/mathe/2219/2219'),
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: castToUuid(2220),
  revisionIds: [2220].map(castToUuid),
  licenseId,
  parentId: exerciseGroup.id,
  canonicalSubjectId: castToUuid(5),
}

export const groupedExerciseRevision: Model<'GroupedExerciseRevision'> = {
  __typename: EntityRevisionType.GroupedExerciseRevision,
  id: castToUuid(2220),
  trashed: false,
  alias: castToAlias('/mathe/2220/2220'),
  date: '2014-09-15T15:28:35Z',
  authorId: user.id,
  repositoryId: groupedExercise.id,
  content: castToNonEmptyString('content'),
  changes: 'changes',
}
