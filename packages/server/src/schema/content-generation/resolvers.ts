import { createNamespace, Queries } from '~/internals/graphql'

export const resolvers: Queries<'contentGeneration'> = {
  Query: {
    contentGeneration: createNamespace(),
  },
  ContentGenerationQuery: {
    async generatedContent(_parent, payload, { dataSources }) {
      // @ts-expect-error TODO: Eslint complaining, no idea why
      return await dataSources.model.serlo.getGeneratedContent(payload)
    },
  },
}
