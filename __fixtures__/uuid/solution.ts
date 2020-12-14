/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as R from 'ramda'

import {
  AliasPayload,
  EntityRevisionType,
  EntityType,
  SolutionPayload,
  SolutionRevisionPayload,
} from '../../src/schema'
import { Instance } from '../../src/types'
import { license } from '../license'
import { exercise } from './exercise'

export const solutionAlias: AliasPayload = {
  id: 29648,
  instance: Instance.De,
  path: '/29648/29648',
}

export const solution: SolutionPayload = {
  __typename: EntityType.Solution,
  id: 29648,
  trashed: false,
  instance: Instance.De,
  alias: '/29648/29648',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 29652,
  revisionIds: [29652],
  licenseId: license.id,
  parentId: exercise.id,
}

export const solutionRevision: SolutionRevisionPayload = {
  __typename: EntityRevisionType.SolutionRevision,
  id: 29652,
  trashed: false,
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: solution.id,
  content: 'content',
  changes: 'changes',
}

export function getSolutionDataWithoutSubResolvers(solution: SolutionPayload) {
  return R.omit(
    ['currentRevisionId', 'revisionIds', 'licenseId', 'parentId'],
    solution
  )
}

export function getSolutionRevisionDataWithoutSubResolvers(
  solutionRevision: SolutionRevisionPayload
) {
  return R.omit(['authorId', 'repositoryId'], solutionRevision)
}
