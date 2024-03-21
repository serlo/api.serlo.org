import { TypeResolvers } from '~/internals/graphql'
import {
  ExerciseGroupDecoder,
  ExerciseGroupRevisionDecoder,
} from '~/model/decoder'
import { createEntityResolvers } from '~/schema/uuid/abstract-entity/utils'
import { createRevisionResolvers } from '~/schema/uuid/abstract-repository/utils'
import { createTaxonomyTermChildResolvers } from '~/schema/uuid/abstract-taxonomy-term-child/utils'
import { ExerciseGroup, ExerciseGroupRevision } from '~/types'

export const resolvers: TypeResolvers<ExerciseGroup> &
  TypeResolvers<ExerciseGroupRevision> = {
  ExerciseGroup: {
    ...createEntityResolvers({
      revisionDecoder: ExerciseGroupRevisionDecoder,
    }),
    ...createTaxonomyTermChildResolvers(),
  },
  ExerciseGroupRevision: createRevisionResolvers({
    repositoryDecoder: ExerciseGroupDecoder,
  }),
}
