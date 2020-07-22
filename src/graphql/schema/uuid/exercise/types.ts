import {
  AbstractEntityRevisionPreResolver,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { AbstractTaxonomyTermChildPreResolver } from '../abstract-taxonomy-term-child'

export interface ExercisePreResolver
  extends AbstractTaxonomyTermChildPreResolver {
  __typename: EntityType.Exercise
  solutionId: number | null
}

export type ExercisePayload = ExercisePreResolver

export interface ExerciseRevisionPreResolver
  extends AbstractEntityRevisionPreResolver {
  __typename: EntityRevisionType.ExerciseRevision
  content: string
  changes: string
}

export type ExerciseRevisionPayload = ExerciseRevisionPreResolver
