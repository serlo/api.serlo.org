import { PickResolvers } from '~/internals/graphql'
import { SolutionDecoder } from '~/model/decoder'

export function createExerciseResolvers(): PickResolvers<
  'AbstractExercise',
  'solution'
> {
  return {
    async solution(exercise, _args, { dataSources }) {
      if (exercise.solutionId === null) return null
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: exercise.solutionId,
        decoder: SolutionDecoder,
      })
    },
  }
}
