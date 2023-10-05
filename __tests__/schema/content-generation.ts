import gql from 'graphql-tag'
import { rest } from 'msw'

import { user as baseUser } from '../../__fixtures__'
import { Client, given, nextUuid } from '../__utils__'

const mockPythonServiceResponse = JSON.stringify({
  heading: 'Exercises for 7th grade',
  subtasks: [
    {
      question: 'What is the 2nd binomial formula?',
    },
  ],
})

// server is a global variable that is defined in __config__/setup.ts
server.use(
  rest.get(
    `http://${process.env.CONTENT_GENERATION_SERVICE_HOST}/exercises`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.text(mockPythonServiceResponse))
    },
  ),
)

const user = { ...baseUser, roles: ['de_reviewer'] }

const userWithNoPermissionId = nextUuid(baseUser.id)
const userWithNoPermission = {
  ...baseUser,
  id: userWithNoPermissionId,
  roles: [],
}

const userWithWrongRole = {
  ...baseUser,
  id: nextUuid(userWithNoPermissionId),
  // Being a guest or architect is not sufficient. One has to be a reviewer.
  roles: ['guest', 'de_architect'],
}

beforeEach(() => {
  given('UuidQuery').for(user, userWithNoPermission, userWithWrongRole)
})

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
        data: mockPythonServiceResponse,
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

test('fails for unauthorized user (no roles)', async () => {
  const client = new Client({ userId: userWithNoPermission.id })
    .prepareQuery({
      query: generateContentQuery,
    })
    .withVariables(payload)

  await client.shouldFailWithError('FORBIDDEN')
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
