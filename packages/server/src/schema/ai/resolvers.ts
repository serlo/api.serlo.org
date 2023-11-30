import * as auth from '@serlo/authorization'
import { Scope } from '@serlo/authorization'
import { either as E } from 'fp-ts'
import * as t from 'io-ts'

import { UserInputError } from '~/errors'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  Queries,
} from '~/internals/graphql'

const ChatCompletionMessageParamType = t.type({
  // Restricts role to 'user' or 'system'. Right now, we don't want to allow
  // assistant-, tool-, or function calls. See
  // https://github.com/openai/openai-node/blob/a048174c0e53269a01993a573a10f96c4c9ec79e/src/resources/chat/completions.ts#L405
  role: t.union([t.literal("user"), t.literal("system")]),
  content: t.string,
})

const ExecutePromptRequestType = t.type({
  messages: t.array(ChatCompletionMessageParamType),
})

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
      const { messages } = payload

      const validationResult = ExecutePromptRequestType.decode({ messages })
      if (E.isLeft(validationResult)) {
        throw new UserInputError(
          'Must contain exclusively user or system messages',
        )
      }

      const record = await dataSources.model.serlo.executePrompt({
        ...payload,
        messages: validationResult.right.messages,
        userId,
      })

      return { success: true, record }
    },
  },
}
