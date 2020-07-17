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
import { Schema } from '../utils'
import {
  EntityPayload,
  EntityRevision,
  EntityRevisionPayload,
  EntityRevisionType,
  EntityType,
} from './abstract-entity'
import {
  addTaxonomyTermChildResolvers,
  TaxonomyTermChild,
} from './abstract-taxonomy-term-child'
import { GroupedExercise, GroupedExercisePayload } from './grouped-exercise'

export const exerciseGroupSchema = new Schema()

export class ExerciseGroup extends TaxonomyTermChild {
  public __typename = EntityType.ExerciseGroup
  public exerciseIds: number[]

  public constructor(payload: ExerciseGroupPayload) {
    super(payload)
    this.exerciseIds = payload.exerciseIds
  }
}
export interface ExerciseGroupPayload extends EntityPayload {
  __typename: EntityType.ExerciseGroup
  taxonomyTermIds: number[]
  exerciseIds: number[]
}
exerciseGroupSchema.addResolver<ExerciseGroup, unknown, GroupedExercise[]>(
  'ExerciseGroup',
  'exercises',
  (entity, _args, { dataSources }) => {
    return Promise.all(
      entity.exerciseIds.map((id: number) => {
        return dataSources.serlo
          .getUuid<GroupedExercisePayload>({ id })
          .then((data) => {
            return new GroupedExercise(data)
          })
      })
    )
  }
)

export class ExerciseGroupRevision extends EntityRevision {
  public __typename = EntityRevisionType.ExerciseGroupRevision
  public content: string
  public changes: string

  public constructor(payload: ExerciseGroupRevisionPayload) {
    super(payload)
    this.content = payload.content
    this.changes = payload.changes
  }
}

export interface ExerciseGroupRevisionPayload extends EntityRevisionPayload {
  __typename: EntityRevisionType.ExerciseGroupRevision
  content: string
  changes: string
}

addTaxonomyTermChildResolvers({
  schema: exerciseGroupSchema,
  entityType: EntityType.ExerciseGroup,
  entityRevisionType: EntityRevisionType.ExerciseGroupRevision,
  repository: 'exerciseGroup',
  Entity: ExerciseGroup,
  EntityRevision: ExerciseGroupRevision,
  entityFields: `
    taxonomyTerms: [TaxonomyTerm!]!
    exercises: [GroupedExercise!]!
  `,
  entityPayloadFields: `
    taxonomyTermIds: [Int!]!
    exerciseIds: [Int!]!
  `,
  entityRevisionFields: `
    content: String!
    changes: String!
  `,
  entitySetter: 'setExerciseGroup',
  entityRevisionSetter: 'setExerciseGroupRevision',
})
