import { Schema } from '../utils'
import {
  addEntityResolvers,
  Entity,
  EntityPayload,
  EntityType,
  EntityRevision,
  EntityRevisionPayload,
  EntityRevisionType,
} from './abstract-entity'

export const solutionSchema = new Schema()

export class Solution extends Entity {
  public __typename = EntityType.Solution
}

export type SolutionPayload = EntityPayload

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
  entityRevisionFields: `
    content: String!
    changes: String!
  `,
  entitySetter: 'setSolution',
  entityRevisionSetter: 'setSolutionRevision',
})
