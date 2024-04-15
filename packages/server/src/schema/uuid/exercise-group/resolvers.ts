import {
  ExerciseGroupDecoder,
  ExerciseGroupRevisionDecoder,
} from '~/model/decoder'
import {
  createRevisionResolvers,
  createRepositoryResolvers,
} from '~/schema/uuid/abstract-repository/utils'
import { createTaxonomyTermChildResolvers } from '~/schema/uuid/abstract-taxonomy-term-child/utils'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  ExerciseGroup: {
    ...createRepositoryResolvers({
      revisionDecoder: ExerciseGroupRevisionDecoder,
    }),
    ...createTaxonomyTermChildResolvers(),
  },
  ExerciseGroupRevision: createRevisionResolvers({
    repositoryDecoder: ExerciseGroupDecoder,
  }),
}
