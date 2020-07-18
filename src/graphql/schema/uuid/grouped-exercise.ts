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
import { requestsOnlyFields, Schema } from '../utils'
import {
  addEntityResolvers,
  EntityType,
  EntityRevisionType,
  Entity,
  EntityPayload,
} from './abstract-entity'
import { ExerciseRevision, ExerciseRevisionPayload } from './exercise'
import { ExerciseGroup, ExerciseGroupPayload } from './exercise-group'
import typeDefs from './grouped-exercise.graphql'
import { Solution, SolutionPayload } from './solution'

export const groupedExerciseSchema = new Schema({}, [typeDefs])

export class GroupedExercise extends Entity {
  public __typename = EntityType.GroupedExercise
  public solutionId: number | null
  public parentId: number

  public constructor(payload: GroupedExercisePayload) {
    super(payload)
    this.solutionId = payload.solutionId
    this.parentId = payload.parentId
  }
}
export interface GroupedExercisePayload extends EntityPayload {
  __typename: EntityType.GroupedExercise
  solutionId: number | null
  parentId: number
}
groupedExerciseSchema.addResolver<
  GroupedExercise,
  unknown,
  Partial<Solution> | null
>(
  'GroupedExercise',
  'solution',
  async (entity, _args, { dataSources }, info) => {
    if (!entity.solutionId) return null
    const partialSolution = { id: entity.solutionId }
    if (requestsOnlyFields('Solution', ['id'], info)) {
      return partialSolution
    }
    const data = await dataSources.serlo.getUuid<SolutionPayload>(
      partialSolution
    )
    return new Solution(data)
  }
)
groupedExerciseSchema.addResolver<
  GroupedExercise,
  unknown,
  Partial<ExerciseGroup>
>(
  'GroupedExercise',
  'exerciseGroup',
  async (entity, _args, { dataSources }, info) => {
    const partialExerciseGroup = { id: entity.parentId }
    if (requestsOnlyFields('ExerciseGroup', ['id'], info)) {
      return partialExerciseGroup
    }
    const data = await dataSources.serlo.getUuid<ExerciseGroupPayload>(
      partialExerciseGroup
    )
    return new ExerciseGroup(data)
  }
)

export class GroupedExerciseRevision extends ExerciseRevision {
  public constructor(payload: GroupedExerciseRevisionPayload) {
    super({ ...payload, __typename: EntityRevisionType.ExerciseRevision })
    this.__typename = EntityRevisionType.GroupedExerciseRevision
  }
}
export interface GroupedExerciseRevisionPayload
  extends Omit<ExerciseRevisionPayload, '__typename'> {
  __typename: EntityRevisionType.GroupedExerciseRevision
}

addEntityResolvers({
  schema: groupedExerciseSchema,
  entityType: EntityType.GroupedExercise,
  entityRevisionType: EntityRevisionType.GroupedExerciseRevision,
  repository: 'groupedExercise',
  Entity: GroupedExercise,
  EntityRevision: GroupedExerciseRevision,
  entitySetter: 'setGroupedExercise',
  entityRevisionSetter: 'setGroupedExerciseRevision',
})
