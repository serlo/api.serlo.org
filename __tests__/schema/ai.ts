import gql from 'graphql-tag'
import { rest } from 'msw'
// eslint-disable-next-line import/no-internal-modules
import { ChatCompletion } from 'openai/resources'

import { user as baseUser } from '../../__fixtures__'
import {
  Client,
  RestResolver,
  given,
  hasInternalServerError,
} from '../__utils__'

interface ChoicesFromChatCompletion {
  choices: ChatCompletion['choices']
}

const mockedOpenAiResponse: ChoicesFromChatCompletion = {
  choices: [
    {
      finish_reason: 'stop',
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
    query ($prompt: String!) {
      ai {
        executePrompt(prompt: $prompt) {
          success
          record
        }
      }
    }
  `,
  variables: { prompt: 'Generate exercise for 7th grade math in json' },
})

beforeAll(() => {
  mockOpenAIServer((_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockedOpenAiResponse))
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
  await query.forLoginUser('de_architect').shouldFailWithError('FORBIDDEN')
})

test('fails when internal server error open ai api occurs', async () => {
  mockOpenAIServer(hasInternalServerError())

  await query.shouldFailWithError('INTERNAL_SERVER_ERROR')
})

function mockOpenAIServer(resolver: RestResolver) {
  // server is a global variable that is defined in __config__/setup.ts
  global.server.use(
    rest.post('https://api.openai.com/v1/chat/completions', resolver),
  )
}
