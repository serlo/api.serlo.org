import { requestsOnlyFields, Schema } from '../utils'
import {
  addEntityResolvers,
  EntityType,
  EntityRevisionType,
  Entity,
  EntityPayload,
} from './abstract-entity'
import { ExerciseRevision, ExerciseRevisionPayload } from './exercise'
import { Solution } from './solution'

export const groupedExerciseSchema = new Schema()

export class GroupedExercise extends Entity {
  public __typename = EntityType.GroupedExercise
  public solutionId: number | null

  public constructor(payload: GroupedExercisePayload) {
    super(payload)
    this.solutionId = payload.solutionId
  }
}
export interface GroupedExercisePayload extends EntityPayload {
  solutionId: number | null
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
    const data = await dataSources.serlo.getUuid(partialSolution)
    return new Solution(data)
  }
)

export class GroupedExerciseRevision extends ExerciseRevision {
  public __typename = EntityRevisionType.GroupedExerciseRevision
}
export type GroupedExerciseRevisionPayload = ExerciseRevisionPayload

addEntityResolvers({
  schema: groupedExerciseSchema,
  entityType: EntityType.GroupedExercise,
  entityRevisionType: EntityRevisionType.GroupedExerciseRevision,
  repository: 'groupedExercise',
  Entity: GroupedExercise,
  EntityRevision: GroupedExerciseRevision,
  entityFields: `
    solution: Solution
  `,
  entityPayloadFields: `
    solutionId: Int
  `,
  entityRevisionFields: `
    content: String!
    changes: String!
  `,
  entitySetter: 'setGroupedExercise',
  entityRevisionSetter: 'setGroupedExerciseRevision',
})
