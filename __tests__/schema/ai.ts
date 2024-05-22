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

beforeEach(() => {
  server.listen({
    // We want to know if there are any requests going through to the OpenAI
    // server. It should not happen! If this fails, check if the URL we are
    // intercepting is still correct here (make sure to change branch to master
    // or the latest tag)
    // https://github.com/openai/openai-node/blob/c17fcb789f8b40dd8360c2680a34e96dbde8a97f/src/index.ts#L130
    onUnhandledRequest: (req) => {
      if (req.url.includes('openai')) {
        // eslint-disable-next-line no-console
        console.error(`Unhandled request to ${req.url}`, req)

        throw new Error("Don't send requests to OpenAI in tests!")
      }
    },
  })

  mockOpenAIServer(() => {
    return HttpResponse.json(mockedOpenAiResponse)
  })

  given('UuidQuery').for(user)
})

afterEach(() => {
  global.server.resetHandlers()
})

// set it back to 'bypass' as defined in our 'sjest.setup.ts
afterAll(() => {
  global.server.listen({ onUnhandledRequest: 'bypass' })
})

test('successfully generate content for reviewer', async () => {
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
test('successfully generate content for student (not logged in) - staging', async () => {
  const nonLoggedInQuery = new Client().prepareQuery({
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
        {
          role: 'user',
          content: 'Generate exercise for 7th grade math in json',
        },
      ],
    },
  })

  await nonLoggedInQuery.shouldReturnData({
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

test('successfully generate content for architect - staging', async () => {
  await query.forLoginUser('de_architect').shouldReturnData({
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

test('fails for unauthenticated user in production', async () => {
  const previousEnvironment = process.env.ENVIRONMENT
  process.env.ENVIRONMENT = 'production'
  await query.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
  process.env.ENVIRONMENT = previousEnvironment
})

test('fails for unauthorized user (wrong role) in production', async () => {
  const previousEnvironment = process.env.ENVIRONMENT
  process.env.ENVIRONMENT = 'production'
  await query.forLoginUser('de_moderator').shouldFailWithError('FORBIDDEN')
  process.env.ENVIRONMENT = previousEnvironment
})

test('fails when internal server error open ai api occurs', async () => {
  mockOpenAIServer(hasInternalServerError())

  await query.shouldFailWithError('INTERNAL_SERVER_ERROR')
})

function mockOpenAIServer(resolver: ResponseResolver) {
  // server is a global variable that is defined in jest.setup.ts
  global.server.use(
    http.post('https://api.openai.com/v1/chat/completions', resolver),
  )
}
