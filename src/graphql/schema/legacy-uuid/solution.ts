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
import { Exercise } from './exercise'

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
    const data = await dataSources.serlo.getUuid(partialSolution)
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
    # FIXME: or GroupedExercise! 
    exercise: Exercise!
  `,
  entityRevisionFields: `
    content: String!
    changes: String!
  `,
  entitySetter: 'setSolution',
  entityRevisionSetter: 'setSolutionRevision',
})
