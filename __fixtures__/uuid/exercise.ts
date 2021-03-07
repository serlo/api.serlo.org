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
import { Model } from '~/model'
import {
  EntityRevisionType,
  EntityType,
} from '~/schema/uuid/abstract-entity/types'
import { Exercise, ExerciseRevision, Instance } from '~/types'

export const exercise: Model<Exercise> = {
  __typename: EntityType.Exercise,
  id: 29637,
  trashed: false,
  instance: Instance.De,
  alias: '/mathe/29637/29637',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 29638,
  revisionIds: [29638],
  licenseId: license.id,
  solutionId: 29648,
  taxonomyTermIds: [5],
}

export const exerciseRevision: Model<ExerciseRevision> = {
  __typename: EntityRevisionType.ExerciseRevision,
  id: 29638,
  trashed: false,
  alias: '/mathe/29638/29638',
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: exercise.id,
  content: 'content',
  changes: 'changes',
}

export function getExerciseDataWithoutSubResolvers(exercise: Model<Exercise>) {
  return R.omit(
    [
      'currentRevisionId',
      'revisionIds',
      'licenseId',
      'taxonomyTermIds',
      'solutionId',
      'alias',
    ],
    exercise
  )
}

export function getExerciseRevisionDataWithoutSubResolvers(
  exerciseRevision: Model<ExerciseRevision>
) {
  return R.omit(['authorId', 'repositoryId', 'alias'], exerciseRevision)
}
