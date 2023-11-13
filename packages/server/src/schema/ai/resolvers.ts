import * as auth from '@serlo/authorization'
import { Scope } from '@serlo/authorization'

import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  Queries,
} from '~/internals/graphql'

export const resolvers: Queries<'ai'> = {
  Query: {
    ai: createNamespace(),
  },
  AiQuery: {
    async executePrompt(_parent, payload, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        userId,
        guard: auth.Ai.executePrompt(Scope.Serlo_De),
        message: 'Insufficient role to execute the prompt.',
        dataSources,
      })

      const record = await dataSources.model.serlo.executePrompt({
        ...payload,
        userId,
      })

      return { success: true, record }
    },
  },
}
