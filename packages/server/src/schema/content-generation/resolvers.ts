import { createNamespace, Queries } from '~/internals/graphql'

export const resolvers: Queries<'contentGeneration'> = {
  Query: {
    contentGeneration: createNamespace(),
  },
  ContentGenerationQuery: {
    generatedContent() {
      return {
        type: 'fakeExercise',
      }
    },
  },
}
