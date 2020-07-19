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
  Entity,
  EntityPayload,
  EntityType,
  EntityRevision,
  EntityRevisionPayload,
  EntityRevisionType,
} from './abstract-entity'
import { Exercise, ExercisePayload } from './exercise'

export const solutionSchema = new Schema()

export class Solution extends Entity {
  public __typename = EntityType.Solution
  public parentId: number

  public constructor(payload: SolutionPayload) {
    super(payload)
    this.parentId = payload.parentId
  }
}
export interface SolutionPayload extends EntityPayload {
  parentId: number
}
solutionSchema.addResolver<Solution, unknown, Partial<Exercise>>(
  'Solution',
  'exercise',
  async (entity, _args, { dataSources }, info) => {
    const partialSolution = { id: entity.parentId }
    if (requestsOnlyFields('Exercise', ['id'], info)) {
      return partialSolution
    }
    const data = await dataSources.serlo.getUuid<ExercisePayload>(
      partialSolution
    )
    return new Exercise(data)
  }
)

export class SolutionRevision extends EntityRevision {
  public __typename = EntityRevisionType.SolutionRevision
  public content: string
  public changes: string

  public constructor(payload: SolutionRevisionPayload) {
    super(payload)
    this.content = payload.content
    this.changes = payload.changes
  }
}

export interface SolutionRevisionPayload extends EntityRevisionPayload {
  content: string
  changes: string
}

addEntityResolvers({
  schema: solutionSchema,
  entityType: EntityType.Solution,
  entityRevisionType: EntityRevisionType.SolutionRevision,
  repository: 'solution',
  Entity: Solution,
  EntityRevision: SolutionRevision,
  entityPayloadFields: `
    parentId: Int!
  `,
  entityFields: `
    exercise: Exercise!
  `,
  entityRevisionFields: `
    content: String!
    changes: String!
  `,
})
