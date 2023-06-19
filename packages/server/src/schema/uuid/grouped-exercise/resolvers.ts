import { TypeResolvers } from '~/internals/graphql'
import {
  ExerciseGroupDecoder,
  GroupedExerciseDecoder,
  GroupedExerciseRevisionDecoder,
} from '~/model/decoder'
import { createEntityResolvers } from '~/schema/uuid/abstract-entity/utils'
import { createExerciseResolvers } from '~/schema/uuid/abstract-exercise/utils'
import { createRevisionResolvers } from '~/schema/uuid/abstract-repository/utils'
import { GroupedExercise, GroupedExerciseRevision } from '~/types'

export const resolvers: TypeResolvers<GroupedExercise> &
  TypeResolvers<GroupedExerciseRevision> = {
  GroupedExercise: {
    ...createEntityResolvers({
      revisionDecoder: GroupedExerciseRevisionDecoder,
    }),
    ...createExerciseResolvers(),
    async exerciseGroup(groupedExercise, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: groupedExercise.parentId,
        decoder: ExerciseGroupDecoder,
      })
    },
  },
  GroupedExerciseRevision: createRevisionResolvers({
    repositoryDecoder: GroupedExerciseDecoder,
  }),
}
