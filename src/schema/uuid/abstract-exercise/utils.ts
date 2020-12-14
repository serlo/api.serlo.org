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
import { SolutionPayload } from '../solution'
import { AbstractExercisePayload } from './types'
import { requestsOnlyFields, Resolver } from '~/internals/graphql'

export interface ExerciseResolvers<E extends AbstractExercisePayload> {
  solution: Resolver<E, never, Partial<SolutionPayload> | null>
}

export function createExerciseResolvers<
  E extends AbstractExercisePayload
>(): ExerciseResolvers<E> {
  return {
    async solution(exercise, _args, { dataSources }, info) {
      if (!exercise.solutionId) return null
      const partialSolution = { id: exercise.solutionId }
      if (requestsOnlyFields('Solution', ['id'], info)) {
        return partialSolution
      }
      return await dataSources.model.serlo.getUuid(partialSolution)
    },
  }
}
