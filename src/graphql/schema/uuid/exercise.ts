import { requestsOnlyFields, Schema } from '../utils'
import {
  addEntityResolvers,
  EntityPayload,
  EntityType,
  EntityRevision,
  EntityRevisionPayload,
  EntityRevisionType,
} from './abstract-entity'
import { TaxonomyTermChild } from './abstract-taxonomy-term-child'
import { Solution } from './solution'
import { TaxonomyTerm } from './taxonomy-term'

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
exerciseSchema.addResolver<Exercise, unknown, TaxonomyTerm[]>(
  'Exercise',
  'taxonomyTerms',
  (entity, _args, { dataSources }) => {
    return Promise.all(
      entity.taxonomyTermIds.map((id: number) => {
        return dataSources.serlo.getUuid({ id }).then((data) => {
          return new TaxonomyTerm(data)
        })
      })
    )
  }
)
exerciseSchema.addResolver<Exercise, unknown, Partial<Solution> | null>(
  'Exercise',
  'solution',
  async (entity, _args, { dataSources }, info) => {
    if (!entity.solutionId) return null
    const partialSolution = { id: entity.solutionId }
    if (requestsOnlyFields('Solution', ['id'], info)) {
      return partialSolution
    }
    const data = await dataSources.serlo.getUuid(partialSolution)
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

addEntityResolvers({
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
  `,
  entitySetter: 'setExercise',
  entityRevisionSetter: 'setExerciseRevision',
})
