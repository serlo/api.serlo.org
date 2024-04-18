import { ExerciseDecoder, ExerciseRevisionDecoder } from '~/model/decoder'
import {
  createEntityRevisionResolvers,
  createEntityResolvers,
} from '~/schema/uuid/abstract-entity/utils'
import { createTaxonomyTermChildResolvers } from '~/schema/uuid/abstract-taxonomy-term-child/utils'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  Exercise: {
    ...createEntityResolvers({ revisionDecoder: ExerciseRevisionDecoder }),
    ...createTaxonomyTermChildResolvers(),
  },
  ExerciseRevision: createEntityRevisionResolvers({
    repositoryDecoder: ExerciseDecoder,
  }),
}
