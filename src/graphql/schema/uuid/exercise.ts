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
  EntityPayload,
  EntityType,
  EntityRevision,
  EntityRevisionPayload,
  EntityRevisionType,
} from './abstract-entity'
import {
  addTaxonomyTermChildResolvers,
  TaxonomyTermChild,
} from './abstract-taxonomy-term-child'
import { Solution, SolutionPayload } from './solution'

export const exerciseSchema = new Schema()

export class Exercise extends TaxonomyTermChild {
  public __typename = EntityType.Exercise
  public solutionId: number | null

  public constructor(payload: ExercisePayload) {
    super(payload)
    this.solutionId = payload.solutionId
  }
}
export interface ExercisePayload extends EntityPayload {
  taxonomyTermIds: number[]
  solutionId: number | null
}
exerciseSchema.addResolver<Exercise, unknown, Partial<Solution> | null>(
  'Exercise',
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

export class ExerciseRevision extends EntityRevision {
  public __typename = EntityRevisionType.ExerciseRevision
  public content: string
  public changes: string

  public constructor(payload: ExerciseRevisionPayload) {
    super(payload)
    this.content = payload.content
    this.changes = payload.changes
  }
}

export interface ExerciseRevisionPayload extends EntityRevisionPayload {
  content: string
  changes: string
}

addTaxonomyTermChildResolvers({
  schema: exerciseSchema,
  entityType: EntityType.Exercise,
  entityRevisionType: EntityRevisionType.ExerciseRevision,
  repository: 'exercise',
  Entity: Exercise,
  EntityRevision: ExerciseRevision,
  entityFields: `
    taxonomyTerms: [TaxonomyTerm!]!
    solution: Solution
  `,
  entityPayloadFields: `
    taxonomyTermIds: [Int!]!
    solutionId: Int
  `,
  entityRevisionFields: `
    content: String!
    changes: String!
  `
})
