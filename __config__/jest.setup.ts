import {
  createAfterAll,
  createAfterEach,
  createBeforeAll,
  createBeforeEach,
  setup,
} from './setup'

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
        req.url.href.includes(process.env.SERLO_ORG_DATABASE_LAYER_HOST)
      ) {
        console.error('Found an unhandled request for message %s', req.text())
      } else {
        console.error(
          'Found an unhandled %s request to %s',
          req.method,
          req.url.href
        )
      }
    },
  })
})

beforeEach(createBeforeEach)

afterEach(createAfterEach)

afterAll(createAfterAll)
