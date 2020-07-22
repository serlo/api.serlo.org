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
import { GraphQLResolveInfo } from 'graphql'

import { Context } from '../../types'
import { requestsOnlyFields } from '../../utils'
import {
  createEntityResolvers,
  createEntityRevisionResolvers,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { ExerciseGroupPayload } from '../exercise-group'
import { SolutionPayload } from '../solution'
import {
  GroupedExercisePreResolver,
  GroupedExerciseRevisionPreResolver,
} from './types'

export const resolvers = {
  GroupedExercise: {
    ...createEntityResolvers<
      GroupedExercisePreResolver,
      GroupedExerciseRevisionPreResolver
    >({
      entityRevisionType: EntityRevisionType.GroupedExerciseRevision,
    }),
    async solution(
      groupedExercise: GroupedExercisePreResolver,
      _args: never,
      { dataSources }: Context,
      info: GraphQLResolveInfo
    ) {
      if (!groupedExercise.solutionId) return null
      const partialSolution = { id: groupedExercise.solutionId }
      if (requestsOnlyFields('Solution', ['id'], info)) {
        return partialSolution
      }
      return dataSources.serlo.getUuid<SolutionPayload>(partialSolution)
    },
    async exerciseGroup(
      groupedExercise: GroupedExercisePreResolver,
      _args: never,
      { dataSources }: Context,
      info: GraphQLResolveInfo
    ) {
      const partialExerciseGroup = { id: groupedExercise.parentId }
      if (requestsOnlyFields('ExerciseGroup', ['id'], info)) {
        return partialExerciseGroup
      }
      return dataSources.serlo.getUuid<ExerciseGroupPayload>(
        partialExerciseGroup
      )
    },
  },
  GroupedExerciseRevision: createEntityRevisionResolvers<
    GroupedExercisePreResolver,
    GroupedExerciseRevisionPreResolver
  >({
    entityType: EntityType.GroupedExercise,
    repository: 'groupedExercise',
  }),
}
