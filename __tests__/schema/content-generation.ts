import gql from 'graphql-tag'
import { rest } from 'msw'

import { user as baseUser } from '../../__fixtures__'
import { Client, given, nextUuid } from '../__utils__'

const mockContentGenerationServiceResponse = JSON.stringify({
  heading: 'Exercises for 7th grade',
  subtasks: [
    {
      question: 'What is the 2nd binomial formula?',
    },
  ],
})

beforeAll(() => {
  // server is a global variable that is defined in __config__/setup.ts
  server.use(
    rest.get(
      `http://${process.env.CONTENT_GENERATION_SERVICE_HOST}/exercises`,
      (_req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.text(mockContentGenerationServiceResponse),
        )
      },
    ),
  )
})

const user = { ...baseUser, roles: ['de_reviewer'] }

const userWithWrongRole = {
  ...baseUser,
  id: nextUuid(user.id),
  // Being an architect is not sufficient. One has to be a reviewer.
  roles: ['login', 'de_architect'],
}

beforeEach(() => {
  given('UuidQuery').for(user, userWithWrongRole)
})

const payload = {
  prompt: 'Generate exercise for 7th grade math',
}

const generateContentQuery = gql`
  query GenerateContent($prompt: String!) {
    contentGeneration {
      generateContent(prompt: $prompt) {
        success
        data
      }
    }
  }
`

test('successfully generate content', async () => {
  const client = new Client({ userId: user.id })
    .prepareQuery({
      query: generateContentQuery,
    })
    .withVariables(payload)

  await client.shouldReturnData({
    contentGeneration: {
      generateContent: {
        success: true,
        data: mockContentGenerationServiceResponse,
      },
    },
  })
})

test('fails for unauthenticated user', async () => {
  const client = new Client()
    .prepareQuery({
      query: generateContentQuery,
    })
    .withVariables(payload)

  await client.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails for unauthorized user (wrong roles)', async () => {
  const client = new Client({ userId: userWithWrongRole.id })
    .prepareQuery({
      query: generateContentQuery,
    })
    .withVariables(payload)

  await client.shouldFailWithError('FORBIDDEN')
})

test('fails when invalid payload is passed', async () => {
  const invalidPayload: Record<string, unknown> = {
    incorrectKey: 'Invalid value',
  }

  const client = new Client({ userId: user.id })
    .prepareQuery({
      query: generateContentQuery,
    })
    .withVariables(invalidPayload)

  await client.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when internal server error in content generation service occurs', async () => {
  server.use(
    rest.get(
      `http://${process.env.CONTENT_GENERATION_SERVICE_HOST}/exercises`,
      (_req, res, ctx) => {
        return res(ctx.status(500))
      },
    ),
  )

  const triggerErrorPayload = {
    prompt: 'TRIGGER_INTERNAL_ERROR',
  }

  const client = new Client({ userId: user.id })
    .prepareQuery({
      query: generateContentQuery,
    })
    .withVariables(triggerErrorPayload)

  await client.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
