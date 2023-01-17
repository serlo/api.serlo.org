/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
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
  solutionId: castToUuid(29648),
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
