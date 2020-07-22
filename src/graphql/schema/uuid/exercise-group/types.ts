import {
  AbstractEntityRevisionPreResolver,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { AbstractTaxonomyTermChildPreResolver } from '../abstract-taxonomy-term-child'

export interface ExerciseGroupPreResolver
  extends AbstractTaxonomyTermChildPreResolver {
  __typename: EntityType.ExerciseGroup
  exerciseIds: number[]
}

export type ExerciseGroupPayload = ExerciseGroupPreResolver

export interface ExerciseGroupRevisionPreResolver
  extends AbstractEntityRevisionPreResolver {
  __typename: EntityRevisionType.ExerciseGroupRevision
  content: string
  changes: string
}

export type ExerciseGroupRevisionPayload = ExerciseGroupRevisionPreResolver
