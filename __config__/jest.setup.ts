import {
  createAfterAll,
  createAfterEach,
  createBeforeAll,
  createBeforeEach,
  setup,
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

setup()

beforeAll(async () => {
  await createBeforeAll({
    onUnhandledRequest(req) {
      if (
        req.method === 'POST' &&
        req.url.includes(process.env.SERLO_ORG_DATABASE_LAYER_HOST)
      ) {
        console.error('Found an unhandled request for message %s', req.text())
      } else {
        console.error(
          'Found an unhandled %s request to %s',
          req.method,
          req.url,
        )
      }
    },
  })
})

beforeEach(createBeforeEach)

afterEach(createAfterEach)

afterAll(createAfterAll)
