import {
  createEntityResolvers,
  createEntityRevisionResolvers,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import {
  GroupedExercisePreResolver,
  GroupedExerciseRevisionPreResolver,
} from './types'

export const resolvers = {
  GroupedExercise: createEntityResolvers<
    GroupedExercisePreResolver,
    GroupedExerciseRevisionPreResolver
  >({
    entityRevisionType: EntityRevisionType.GroupedExerciseRevision,
  }),
  GroupedExerciseRevision: createEntityRevisionResolvers<
    GroupedExercisePreResolver,
    GroupedExerciseRevisionPreResolver
  >({
    entityType: EntityType.GroupedExercise,
    repository: 'groupedExercise',
  }),
}
