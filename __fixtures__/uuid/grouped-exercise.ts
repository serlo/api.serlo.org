/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as R from 'ramda'

import { license } from '../license'
import { exerciseGroup } from './exercise-group'
import { Model } from '~/internals/graphql'
import { Payload } from '~/internals/model/types'
import {
  EntityRevisionType,
  EntityType,
} from '~/schema/uuid/abstract-entity/types'
import { Instance } from '~/types'

export const groupedExerciseAlias: Payload<'getAlias'> = {
  id: 2219,
  instance: Instance.De,
  path: '/2219/2219',
}

export const groupedExercise: Model<'GroupedExercise'> = {
  __typename: EntityType.GroupedExercise,
  id: 2219,
  trashed: false,
  instance: Instance.De,
  alias: '/mathe/2219/2219',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 2220,
  revisionIds: [2220],
  licenseId: license.id,
  solutionId: 29648,
  parentId: exerciseGroup.id,
}

export const groupedExerciseRevision: Model<'GroupedExerciseRevision'> = {
  __typename: EntityRevisionType.GroupedExerciseRevision,
  id: 2220,
  trashed: false,
  alias: '/mathe/2220/2220',
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: groupedExercise.id,
  content: 'content',
  changes: 'changes',
}

export function getGroupedExerciseDataWithoutSubResolvers(
  groupedExercise: Model<'GroupedExercise'>
) {
  return R.omit(
    [
      'currentRevisionId',
      'revisionIds',
      'licenseId',
      'solutionId',
      'parentId',
      'alias',
    ],
    groupedExercise
  )
}

export function getGroupedExerciseRevisionDataWithoutSubResolvers(
  groupedExerciseRevision: Model<'GroupedExerciseRevision'>
) {
  return R.omit(['authorId', 'repositoryId', 'alias'], groupedExerciseRevision)
}
