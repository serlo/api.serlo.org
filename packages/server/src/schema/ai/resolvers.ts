import * as auth from '@serlo/authorization'
import { Scope } from '@serlo/authorization'
import * as t from 'io-ts'

import { UserInputError } from '~/errors'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
} from '~/internals/graphql'
import { Resolvers } from '~/types'

const ChatCompletionMessageParamType = t.type({
  // Restricts role to 'user' or 'system'. Right now, we don't want to allow
  // assistant-, tool-, or function calls. See
  // https://github.com/openai/openai-node/blob/a048174c0e53269a01993a573a10f96c4c9ec79e/src/resources/chat/completions.ts#L405
  role: t.union([t.literal('user'), t.literal('system')]),
  content: t.string,
})

const ExecutePromptRequestType = t.array(ChatCompletionMessageParamType)

export const resolvers: Resolvers = {
  Query: {
    ai: createNamespace(),
  },
  AiQuery: {
    async executePrompt(_parent, payload, context) {
      const { userId, dataSources } = context

      if (process.env.ENVIRONMENT === 'production') {
        assertUserIsAuthenticated(userId)
        await assertUserIsAuthorized({
          guard: auth.Ai.executePrompt(Scope.Serlo_De),
          message: 'Insufficient role to execute the prompt.',
          context,
        })
      }
      const { messages } = payload

      if (!ExecutePromptRequestType.is(messages)) {
        throw new UserInputError(
          'Must contain exclusively user or system messages',
        )
      }

      const record = await dataSources.model.serlo.executePrompt({
        ...payload,
        messages,
        userId,
      })

      return { success: true, record }
    },
  },
}
