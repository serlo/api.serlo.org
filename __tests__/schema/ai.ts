import gql from 'graphql-tag'
import { HttpResponse, ResponseResolver, http } from 'msw'
import type { OpenAI } from 'openai'

import { user as baseUser } from '../../__fixtures__'
import { Client, given, hasInternalServerError } from '../__utils__'

interface ChoicesFromChatCompletion {
  choices: OpenAI.ChatCompletion['choices']
}

const mockedOpenAiResponse: ChoicesFromChatCompletion = {
  choices: [
    {
      finish_reason: 'stop',
      logprobs: null,
      index: 0,
      message: {
        role: 'assistant',
        content: JSON.stringify({
          heading: 'Exercises for 7th grade',
          subtasks: [
            {
              question: 'What is the 2nd binomial formula?',
            },
          ],
        }),
      },
    },
  ],
}

const user = { ...baseUser, roles: ['de_reviewer'] }

const query = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    query ($messages: [ChatCompletionMessageParam!]!) {
      ai {
        executePrompt(messages: $messages) {
          success
          record
        }
      }
    }
  `,
  variables: {
    messages: [
      { role: 'user', content: 'Generate exercise for 7th grade math in json' },
    ],
  },
})

beforeAll(() => {
  mockOpenAIServer(() => {
    return HttpResponse.json(mockedOpenAiResponse)
  })
})

beforeEach(() => {
  given('UuidQuery').for(user)
})

test('successfully generate content', async () => {
  await query.shouldReturnData({
    ai: {
      executePrompt: {
        success: true,
        record: JSON.parse(
          mockedOpenAiResponse.choices[0].message.content || '',
        ) as ChoicesFromChatCompletion,
      },
    },
  })
})

test('fails for unauthenticated user', async () => {
  await query.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails for unauthorized user (wrong roles)', async () => {
  await query.forLoginUser('de_moderator').shouldFailWithError('FORBIDDEN')
})

test('fails when internal server error open ai api occurs', async () => {
  mockOpenAIServer(hasInternalServerError())

  await query.shouldFailWithError('INTERNAL_SERVER_ERROR')
})

function mockOpenAIServer(resolver: ResponseResolver) {
  // server is a global variable that is defined in __config__/setup.ts
  global.server.use(
    http.post('https://api.openai.com/v1/chat/completions', resolver),
  )
}
