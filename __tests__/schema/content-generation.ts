import gql from 'graphql-tag'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { user as baseUser } from '../../__fixtures__'
import { Client } from '../__utils__'

const mockPythonServiceResponse = JSON.stringify({
  heading: 'Exercises for 7th grade',
})

const server = setupServer(
  rest.get(
    `http://${process.env.CONTENT_GENERATION_SERVICE_HOST}/exercises`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.text(mockPythonServiceResponse))
    },
  ),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const user = { ...baseUser, roles: ['de_reviewer'] }

const userWithNoPermission = { ...baseUser, roles: [] }

// Need to extend this hyper flexible record to satisfy .withVariables()
interface GenerateContentPayload extends Record<string, unknown> {
  prompt: string
}

const payload: GenerateContentPayload = {
  prompt: 'Generate exercise for 7th grade math',
}

const generateContentQuery = gql`
  query GenerateContent($prompt: String!) {
    contentGeneration {
      generateContent(payload: { prompt: $prompt }) {
        success
        generatedContent
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
    success: true,
    generatedContent: mockPythonServiceResponse,
  })
})

test('fails for unauthenticated user', async () => {
  const client = new Client({ userId: user.id })
    .prepareQuery({
      query: generateContentQuery,
    })
    .withVariables(payload)

  await client.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails for unauthorized user', async () => {
  // User does not have the correct permissions to execute the prompt
  const client = new Client({ userId: userWithNoPermission.id })
    .prepareQuery({
      query: generateContentQuery,
    })
    .withVariables(payload)

  await client.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
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
