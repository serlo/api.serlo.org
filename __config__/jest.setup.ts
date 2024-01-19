import {
  createAfterAll,
  createAfterEach,
  createBeforeAll,
  createBeforeEach,
} from './setup'

process.env.OPENAI_API_KEY = 'fake-test-key-we-are-mocking-responses'

beforeAll(createBeforeAll)

beforeEach(createBeforeEach)

afterEach(createAfterEach)

afterAll(createAfterAll)
