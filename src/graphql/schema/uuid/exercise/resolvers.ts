import {
  createEntityResolvers,
  createEntityRevisionResolvers,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { createTaxonomyTermChildResolvers } from '../abstract-taxonomy-term-child'
import { ExercisePreResolver, ExerciseRevisionPreResolver } from './types'

export const resolvers = {
  Exercise: {
    ...createEntityResolvers<ExercisePreResolver, ExerciseRevisionPreResolver>({
      entityRevisionType: EntityRevisionType.ExerciseRevision,
    }),
    ...createTaxonomyTermChildResolvers<ExercisePreResolver>(),
  },
  ExerciseRevision: createEntityRevisionResolvers<
    ExercisePreResolver,
    ExerciseRevisionPreResolver
  >({
    entityType: EntityType.Exercise,
    repository: 'exercise',
  }),
}
