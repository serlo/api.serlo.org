import * as auth from '@serlo/authorization'
import { Scope } from '@serlo/authorization'
import { either as E } from 'fp-ts'

import { UserInputError } from '~/errors'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  Queries,
} from '~/internals/graphql'
import { UserInputDecoder } from '~/model/content-generation'

export const resolvers: Queries<'contentGeneration'> = {
  Query: {
    contentGeneration: createNamespace(),
  },
  ContentGenerationQuery: {
    async generateContent(_parent, payload, { dataSources, userId }) {
      const decodedUserInput = UserInputDecoder.decode(payload)

      if (E.isLeft(decodedUserInput)) {
        throw new UserInputError('Prompt needs to be a string.')
      }

      const userInput = decodedUserInput.right

      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        userId,
        guard: auth.Ai.executePrompt(Scope.Serlo_De),
        message: 'Insufficient role to execute the prompt.',
        dataSources,
      })

      const content =
        await dataSources.model.serlo.getGeneratedContent(userInput)

      return {
        success: true,
        data: content,
      }
    },
  },
}
