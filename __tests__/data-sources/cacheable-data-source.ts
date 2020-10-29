/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { createInMemoryCache } from '../../src/cache/in-memory-cache'
import { CacheableDataSource } from '../../src/graphql/data-sources'
import { Cache } from '../../src/graphql/environment'

let cache: Cache
let server: ExampleServer
const nowCopy = Date.now
const now = jest.fn<number, never>()

beforeEach(() => {
  now.mockReturnValue(Date.now())
  Date.now = now

  cache = createInMemoryCache()
  server = new ExampleServer(cache, 'First version')
})

afterEach(() => {
  Date.now = nowCopy
})

class ExampleServer extends CacheableDataSource {
  public maxAge?: number
  public maxStale?: number

  constructor(cache: Cache, private content: string) {
    super(cache)
  }

  public updateContent(content: string) {
    this.content = content
  }

  public async getContent() {
    return await this.getFromCache({
      key: 'content',
      update: () => Promise.resolve(this.content),
      maxAge: this.maxAge,
      maxStale: this.maxStale,
    })
  }

  public updateCache(_key: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

describe('getFromCache()', () => {
  test('returns current value when cache is empty', async () => {
    expect(await server.getContent()).toBe('First version')
  })

  describe('when cache is not empty', () => {
    beforeEach(async () => {
      await server.getContent()
    })

    describe('when maxAge = maxStale = undefined', () => {
      beforeEach(() => {
        server.maxAge = undefined
        server.maxStale = undefined

        waitFor(5)
      })

      test('returns cached value', async () => {
        await assertReturnsCachedValue()
      })

      test('does not update cached value', async () => {
        await assertCacheIsNotUpdatedInBackground()
      })
    })

    describe('when 0 < maxAge and maxStale = undefined', () => {
      beforeEach(() => {
        server.maxAge = 10
        server.maxStale = undefined
      })

      describe('when 0 < passed time < maxAge', () => {
        beforeEach(() => {
          waitFor(5)
        })

        test('returns cached value', async () => {
          await assertReturnsCachedValue()
        })

        test('does not update cached value', async () => {
          await assertCacheIsNotUpdatedInBackground()
        })
      })

      test('returns current value when maxAge < passed time', async () => {
        waitFor(15)

        await assertReturnsCurrentValue()
      })
    })

    describe('when maxAge = undefined and 0 < maxStale', () => {
      beforeEach(() => {
        server.maxAge = undefined
        server.maxStale = 10
      })

      describe('when 0 < passed time < maxStale', () => {
        beforeEach(() => {
          waitFor(5)
        })

        test('returns cached value', async () => {
          await assertReturnsCachedValue()
        })

        test('updates cached value in background', async () => {
          await assertCacheIsUpdatedInBackground()
        })
      })

      test('when maxStale < passed time', async () => {
        waitFor(15)

        await assertReturnsCurrentValue()
      })
    })

    describe('when 0 < maxAge < maxStale < 0', () => {
      beforeEach(() => {
        server.maxAge = 10
        server.maxStale = 20
      })

      describe('when 0 < passed time < maxAge', () => {
        beforeEach(() => {
          waitFor(5)
        })

        test('returns cached value', async () => {
          await assertReturnsCachedValue()
        })

        test('does not update cached value in background', async () => {
          await assertCacheIsNotUpdatedInBackground()
        })
      })

      describe('when maxAge < passed time < maxStale', () => {
        beforeEach(() => {
          waitFor(15)
        })

        test('returns cached value', async () => {
          await assertReturnsCachedValue()
        })

        test('updates cached value in background', async () => {
          await assertCacheIsUpdatedInBackground()
        })
      })

      test('returns current value when maxStale < passed time', async () => {
        waitFor(25)

        await assertReturnsCurrentValue()
      })
    })

    async function assertReturnsCurrentValue() {
      server.updateContent('Second version')

      expect(await server.getContent()).toBe('Second version')
    }

    async function assertReturnsCachedValue() {
      server.updateContent('Second version')

      expect(await server.getContent()).toBe('First version')
    }

    async function assertCacheIsUpdatedInBackground() {
      server.updateContent('Second version')
      await server.getContent()
      server.updateContent('Third version')

      expect(await server.getContent()).toBe('Second version')
    }

    async function assertCacheIsNotUpdatedInBackground() {
      server.updateContent('Second version')
      await server.getContent()
      server.updateContent('Third version')

      expect(await server.getContent()).toBe('First version')
    }
  })

  test('uses predefined cache entries', async () => {
    await cache.set('content', 'Old version')

    expect(await server.getContent()).toBe('Old version')
  })

  describe('throws error', () => {
    const expectError = () =>
      expect(() => server.getContent()).rejects.toBeTruthy()

    test('when maxAge < 0', async () => {
      server.maxAge = -10
      await expectError()
    })

    test('when maxStale < 0', async () => {
      server.maxStale = -10
      await expectError()
    })

    test('when maxStale < maxAge', async () => {
      server.maxAge = 20
      server.maxStale = 10
      await expectError()
    })
  })
})

describe('setCache()', () => {
  test('updates cached value', async () => {
    await server.setCache({
      key: 'content',
      update: () => Promise.resolve('Updated version'),
    })

    expect(await server.getContent()).toBe('Updated version')
  })

  describe('when ttl is passed', () => {
    test('returns cached value when passed time < ttl', async () => {
      await server.setCache({
        key: 'content',
        update: () => Promise.resolve('Updated version'),
        ttl: 10,
      })
      waitFor(5)

      expect(await server.getContent()).toBe('Updated version')
    })

    test('returns current value when ttl < passed time', async () => {
      await server.setCache({
        key: 'content',
        update: () => Promise.resolve('Updated version'),
        ttl: 10,
      })
      waitFor(15)

      expect(await server.getContent()).toBe('First version')
    })

    test('does not use predefined ttl in cache', async () => {
      await cache.set('content', 'Old version', { ttl: 10 })

      await server.setCache({
        key: 'content',
        update: () => Promise.resolve('Updated version'),
        ttl: 20,
      })
      waitFor(15)

      expect(await server.getContent()).toBe('Updated version')
    })
  })

  describe('when ttl is already stored in cache', () => {
    test('returns cached value when passed time < ttl', async () => {
      await cache.set('content', 'Old version', { ttl: 10 })

      await server.setCache({
        key: 'content',
        update: () => Promise.resolve('Updated version'),
      })
      waitFor(5)

      expect(await server.getContent()).toBe('Updated version')
    })

    test('returns current value when ttl < passed time', async () => {
      await cache.set('content', 'Old version', { ttl: 10 })

      await server.setCache({
        key: 'content',
        update: () => Promise.resolve('Updated version'),
      })
      waitFor(15)

      expect(await server.getContent()).toBe('First version')
    })
  })
})

function waitFor(seconds: number) {
  now.mockReturnValue(now() + seconds * 1000)
}
