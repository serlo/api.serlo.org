import { requestsOnlyFields, Schema } from '../utils'
import {
  addEntityResolvers,
  EntityType,
  EntityRevisionType,
  Entity,
  EntityPayload,
} from './abstract-entity'
import { ExerciseRevision, ExerciseRevisionPayload } from './exercise'
import { ExerciseGroup } from './exercise-group'
import { Solution } from './solution'

export const groupedExerciseSchema = new Schema()

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
    const data = await dataSources.serlo.getUuid(partialSolution)
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
    const data = await dataSources.serlo.getUuid(partialExerciseGroup)
    return new ExerciseGroup(data)
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
    exerciseGroup: ExerciseGroup!
  `,
  entityPayloadFields: `
    solutionId: Int
    parentId: Int!
  `,
  entityRevisionFields: `
    content: String!
    changes: String!
  `,
  entitySetter: 'setGroupedExercise',
  entityRevisionSetter: 'setGroupedExerciseRevision',
})
