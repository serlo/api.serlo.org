import { InterfaceResolvers } from '~/internals/graphql'

export const resolvers: InterfaceResolvers<'AbstractExercise'> &
  InterfaceResolvers<'AbstractExerciseRevision'> = {
  AbstractExercise: {
    __resolveType(exercise) {
      return exercise.__typename
    },
  },
  AbstractExerciseRevision: {
    __resolveType(exerciseRevision) {
      return exerciseRevision.__typename
    },
  },
}
