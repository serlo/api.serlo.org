import {
  AbstractEntityRevisionPreResolver,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { AbstractTaxonomyTermChildPreResolver } from '../abstract-taxonomy-term-child'

export interface GroupedExercisePreResolver
  extends AbstractTaxonomyTermChildPreResolver {
  __typename: EntityType.GroupedExercise
  solutionId: number | null
  parentId: number
}

export type GroupedExercisePayload = GroupedExercisePreResolver

export interface GroupedExerciseRevisionPreResolver
  extends AbstractEntityRevisionPreResolver {
  __typename: EntityRevisionType.GroupedExerciseRevision
  content: string
  changes: string
}

export type GroupedExerciseRevisionPayload = GroupedExerciseRevisionPreResolver
