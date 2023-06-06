import { TypeResolvers } from '~/internals/graphql'
import {
  ExerciseGroupDecoder,
  ExerciseGroupRevisionDecoder,
  GroupedExerciseDecoder,
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
    async exercises(exerciseGroup, _args, { dataSources }) {
      return await Promise.all(
        exerciseGroup.exerciseIds.map((id: number) => {
          return dataSources.model.serlo.getUuidWithCustomDecoder({
            id,
            decoder: GroupedExerciseDecoder,
          })
        })
      )
    },
  },
  ExerciseGroupRevision: createRevisionResolvers({
    repositoryDecoder: ExerciseGroupDecoder,
  }),
}
