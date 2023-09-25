import { either as E } from 'fp-ts'

import * as ContentGenerationService from '../../model/content-generation'
import { createNamespace, Queries } from '~/internals/graphql'

export const resolvers: Queries<'contentGeneration'> = {
  Query: {
    contentGeneration: createNamespace(),
  },
  ContentGenerationQuery: {
    async generatedContent(_parent, payload, { dataSources }) {
      try {
        const decodedUserInput =
          ContentGenerationService.UserInputDecoder.decode(payload)

        if (E.isLeft(decodedUserInput)) {
          throw new Error('Invalid user input')
        }

        const userInput = decodedUserInput.right

        const generatedContent =
          await dataSources.model.serlo.getGeneratedContent(userInput)

        return {
          success: true,
          generatedContent,
        }
      } catch (error) {
        return {
          success: false,
          generatedContent: null,
        }
      }
    },
  },
}
