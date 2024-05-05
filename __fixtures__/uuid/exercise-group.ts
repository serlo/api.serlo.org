import { user } from './user'
import { licenseId } from '../license-id'
import { Model } from '~/internals/graphql'
import {
  castToNonEmptyString,
  EntityRevisionType,
  EntityType,
} from '~/model/decoder'
import { Instance } from '~/types'

const exerciseGroupId = 2217

export const exerciseGroupRevision: Model<'ExerciseGroupRevision'> = {
  __typename: EntityRevisionType.ExerciseGroupRevision,
  id: 2218,
  trashed: false,
  alias: '/mathe/2218/2218',
  date: '2014-09-15T15:28:35Z',
  authorId: user.id,
  repositoryId: exerciseGroupId,
  content: castToNonEmptyString('content'),
  changes: 'changes',
}

export const exerciseGroup: Model<'ExerciseGroup'> = {
  __typename: EntityType.ExerciseGroup,
  id: exerciseGroupId,
  trashed: false,
  instance: Instance.De,
  alias: '/mathe/2217/2217',
  date: '2014-03-01T20:54:51.000Z',
  currentRevisionId: 2218,
  revisionIds: [2218],
  licenseId,
  taxonomyTermIds: [5],
  canonicalSubjectId: 5,
}
