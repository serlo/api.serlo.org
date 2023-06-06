import { TypeResolvers } from '~/internals/graphql'
import { ExerciseDecoder, ExerciseRevisionDecoder } from '~/model/decoder'
import { createEntityResolvers } from '~/schema/uuid/abstract-entity/utils'
import { createExerciseResolvers } from '~/schema/uuid/abstract-exercise/utils'
import { createRevisionResolvers } from '~/schema/uuid/abstract-repository/utils'
import { createTaxonomyTermChildResolvers } from '~/schema/uuid/abstract-taxonomy-term-child/utils'
import { Exercise, ExerciseRevision } from '~/types'

export const resolvers: TypeResolvers<Exercise> &
  TypeResolvers<ExerciseRevision> = {
  Exercise: {
    ...createEntityResolvers({ revisionDecoder: ExerciseRevisionDecoder }),
    ...createTaxonomyTermChildResolvers(),
    ...createExerciseResolvers(),
  },
  ExerciseRevision: createRevisionResolvers({
    repositoryDecoder: ExerciseDecoder,
  }),
}
