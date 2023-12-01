import {
  createAfterAll,
  createAfterEach,
  createBeforeAll,
  createBeforeEach,
} from './setup'

process.env.OPENAI_API_KEY = 'fake-test-key-we-are-mocking-responses'

jest.mock('@google-cloud/storage', () => {
  return {
    Storage: jest.fn().mockImplementation(() => ({
      bucket() {
        return {
          file() {
            return {
              getSignedUrl() {
                return ['http://google.com/upload']
              },
            }
          },
        }
      },
    })),
  }
})

beforeAll(createBeforeAll)

beforeEach(createBeforeEach)

afterEach(createAfterEach)

afterAll(createAfterAll)
