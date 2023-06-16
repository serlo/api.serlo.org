import { exercise } from './exercise'
import { user } from './user'
import { license } from '../license'
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

export const solutionAlias: Payload<'serlo', 'getAlias'> = {
  id: 29648,
  instance: Instance.De,
  path: '/29648/29648',
}

export const solution: Model<'Solution'> = {
  __typename: EntityType.Solution,
  id: castToUuid(29648),
  trashed: false,
  instance: Instance.De,
  alias: castToAlias('/mathe/29648/29648'),
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: castToUuid(29652),
  revisionIds: [29652].map(castToUuid),
  licenseId: license.id,
  parentId: exercise.id,
  canonicalSubjectId: castToUuid(5),
}

export const solutionRevision: Model<'SolutionRevision'> = {
  __typename: EntityRevisionType.SolutionRevision,
  id: castToUuid(29652),
  trashed: false,
  alias: castToAlias('/mathe/29652/29652'),
  date: '2014-09-15T15:28:35Z',
  authorId: user.id,
  repositoryId: solution.id,
  content: castToNonEmptyString('content'),
  changes: 'changes',
}
