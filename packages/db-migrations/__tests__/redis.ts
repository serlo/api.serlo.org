import Redis from 'ioredis'

import { ApiCache } from '../src/utils/api-cache'

if (!process.env.REDIS_URL) throw new Error('Test could not start, REDIS_URL missing')
const redis = new Redis(process.env.REDIS_URL)
let apiCache: ApiCache

beforeEach(async () => {
  apiCache = new ApiCache()
  await wait(10) // wait for redis to be ready
})

afterAll(async () => {
  await redis.quit()
})

describe('deleteUuid', () => {
  test('deletes uuid key', async () => {
    await redis.set('de.serlo.org/api/uuid/1', 'hello')

    apiCache.markUuid(1)
    await apiCache.deleteKeysAndQuit()

    expect(await redis.get('de.serlo.org/api/uuid/1')).toBeNull()
  })

  test('does not throw an error when key is not present', async () => {
    apiCache.markUuid(42)
    await apiCache.deleteKeysAndQuit()

    expect(await redis.get('de.serlo.org/api/uuid/42')).toBeNull()
  })
})

async function wait(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}
