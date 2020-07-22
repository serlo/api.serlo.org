import {
  AbstractEntityRevisionPreResolver,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { AbstractTaxonomyTermChildPreResolver } from '../abstract-taxonomy-term-child'

export interface SolutionPreResolver
  extends AbstractTaxonomyTermChildPreResolver {
  __typename: EntityType.Solution
  parentId: number
}

export type SolutionPayload = SolutionPreResolver

export interface SolutionRevisionPreResolver
  extends AbstractEntityRevisionPreResolver {
  __typename: EntityRevisionType.SolutionRevision
  content: string
  changes: string
}

export type SolutionRevisionPayload = SolutionRevisionPreResolver
