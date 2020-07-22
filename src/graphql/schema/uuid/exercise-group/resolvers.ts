import {
  createEntityResolvers,
  createEntityRevisionResolvers,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { createTaxonomyTermChildResolvers } from '../abstract-taxonomy-term-child'
import {
  ExerciseGroupPreResolver,
  ExerciseGroupRevisionPreResolver,
} from './types'

export const resolvers = {
  ExerciseGroup: {
    ...createEntityResolvers<
      ExerciseGroupPreResolver,
      ExerciseGroupRevisionPreResolver
    >({
      entityRevisionType: EntityRevisionType.ExerciseGroupRevision,
    }),
    ...createTaxonomyTermChildResolvers<ExerciseGroupPreResolver>(),
  },
  ExerciseGroupRevision: createEntityRevisionResolvers<
    ExerciseGroupPreResolver,
    ExerciseGroupRevisionPreResolver
  >({
    entityType: EntityType.ExerciseGroup,
    repository: 'exerciseGroup',
  }),
}
