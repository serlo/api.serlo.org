import gql from 'graphql-tag'
import { HttpResponse, ResponseResolver, http } from 'msw'

import { user as baseUser } from '../../__fixtures__'
import { Client, given, hasInternalServerError } from '../__utils__'

const mockContentGenerationServiceResponse = {
  heading: 'Exercises for 7th grade',
  subtasks: [
    {
      question: 'What is the 2nd binomial formula?',
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
  variables: { prompt: 'Generate exercise for 7th grade math' },
})

beforeAll(() => {
  givenContentGenerationService(() => {
    return HttpResponse.json(mockContentGenerationServiceResponse, {
      status: 200,
    })
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
        record: mockContentGenerationServiceResponse,
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

test('fails when internal server error in content generation service occurs', async () => {
  givenContentGenerationService(hasInternalServerError())

  await query.shouldFailWithError('INTERNAL_SERVER_ERROR')
})

function givenContentGenerationService(resolver: ResponseResolver) {
  // server is a global variable that is defined in __config__/setup.ts
  server.use(
    http.get(
      `http://${process.env.CONTENT_GENERATION_SERVICE_HOST}/execute`,
      resolver,
    ),
  )
}
