import Redis from 'ioredis'

import { ApiCache } from '../src/utils/api-cache'

const redis = new Redis(process.env.REDIS_URL as string)
let apiCache: ApiCache

beforeEach(() => {
  apiCache = new ApiCache()
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
