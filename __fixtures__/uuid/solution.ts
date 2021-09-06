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
import { license } from '../license'
import { exercise } from './exercise'
import { user } from './user'
import { Model } from '~/internals/graphql'
import { Payload } from '~/internals/model'
import { castToUuid, EntityRevisionType, EntityType } from '~/model/decoder'
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
  alias: '/mathe/29648/29648',
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
  alias: '/mathe/29652/29652',
  date: '2014-09-15T15:28:35Z',
  authorId: user.id,
  repositoryId: solution.id,
  content: 'content',
  changes: 'changes',
}
