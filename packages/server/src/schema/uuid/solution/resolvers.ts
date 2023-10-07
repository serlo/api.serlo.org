import { TypeResolvers } from '~/internals/graphql'
import {
  AbstractExerciseDecoder,
  SolutionDecoder,
  SolutionRevisionDecoder,
} from '~/model/decoder'
import { createEntityResolvers } from '~/schema/uuid/abstract-entity/utils'
import { createRevisionResolvers } from '~/schema/uuid/abstract-repository/utils'
import { Solution, SolutionRevision } from '~/types'

export const resolvers: TypeResolvers<Solution> &
  TypeResolvers<SolutionRevision> = {
  Solution: {
    ...createEntityResolvers({ revisionDecoder: SolutionRevisionDecoder }),
    async exercise(solution, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: solution.parentId,
        decoder: AbstractExerciseDecoder,
      })
    },
  },
  SolutionRevision: createRevisionResolvers({
    repositoryDecoder: SolutionDecoder,
  }),
}
