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
let dataSource: ExampleDataSource
const now = jest.fn<number, never>()

beforeEach(() => {
  now.mockReturnValue(Date.now())

  cache = createInMemoryCache({ now })
  dataSource = new ExampleDataSource({ cache, timer: { now } })
})

interface Options {
  maxAge?: number
}

class ExampleDataSource extends CacheableDataSource {
  private content = ''

  public setContent(content: string) {
    this.content = content
  }

  public async getContent(args?: Options) {
    return await this.getFromCache({
      key: 'content',
      update: () => Promise.resolve(this.content),
      maxAge: args?.maxAge,
    })
  }

  public updateCache(_key: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

describe('getFromCache()', () => {
  test('returns current value when cache is empty', async () => {
    dataSource.setContent('First version')

    expect(await dataSource.getContent()).toBe('First version')
  })

  describe('when cache is not empty', () => {
    test('when maxAge = undefined: returns cached value without background update', async () => {
      await initializeCache()

      waitFor(5)

      await assertReturnsCachedValue({ maxAge: undefined })
      await assertCacheIsNotUpdatedInBackground({ maxAge: undefined })
    })

    describe('when 0 < maxAge', () => {
      test('when 0 < passed time < maxAge: returns cached value without background update', async () => {
        await initializeCache()

        waitFor(5)

        await assertReturnsCachedValue({ maxAge: 10 })
        await assertCacheIsNotUpdatedInBackground({ maxAge: 10 })
      })

      test('when maxAge < passed time: returns cached value with background update', async () => {
        await initializeCache()

        waitFor(15)

        await assertReturnsCachedValue({ maxAge: 10 })
        await assertCacheIsUpdatedInBackground({ maxAge: 10 })
      })
    })

    async function assertReturnsCachedValue({ maxAge }: Options) {
      dataSource.setContent('Second version')

      expect(await dataSource.getContent({ maxAge })).toBe('First version')
    }

    async function assertCacheIsNotUpdatedInBackground({ maxAge }: Options) {
      dataSource.setContent('Third version')

      expect(await dataSource.getContent({ maxAge })).toBe('First version')
    }

    async function assertCacheIsUpdatedInBackground({ maxAge }: Options) {
      dataSource.setContent('Third version')

      expect(await dataSource.getContent({ maxAge })).toBe('Second version')
    }

    async function initializeCache() {
      dataSource.setContent('First version')
      await dataSource.getContent()
    }
  })

  test('uses predefined cache entries', async () => {
    await cache.set('content', 'Old version')

    expect(await dataSource.getContent()).toBe('Old version')
  })

  test('throws error when maxAge < 0', async () => {
    await expect(() =>
      dataSource.getContent({ maxAge: -10 })
    ).rejects.toBeTruthy()
  })
})

describe('setCache()', () => {
  test('updates cached value', async () => {
    await dataSource.setCache({
      key: 'content',
      update: () => Promise.resolve('Updated version'),
    })

    expect(await dataSource.getContent()).toBe('Updated version')
  })

  describe('when ttl is passed', () => {
    test('returns cached value when passed time < ttl', async () => {
      await dataSource.setCache({
        key: 'content',
        update: () => Promise.resolve('Updated version'),
        ttl: 10,
      })
      waitFor(5)

      expect(await dataSource.getContent()).toBe('Updated version')
    })

    test('returns current value when ttl < passed time', async () => {
      dataSource.setContent('First version')
      await dataSource.setCache({
        key: 'content',
        update: () => Promise.resolve('Updated version'),
        ttl: 10,
      })
      waitFor(15)

      expect(await dataSource.getContent()).toBe('First version')
    })

    test('does not use predefined ttl in cache', async () => {
      await cache.set('content', 'Old version', { ttl: 10 })

      await dataSource.setCache({
        key: 'content',
        update: () => Promise.resolve('Updated version'),
        ttl: 20,
      })
      waitFor(15)

      expect(await dataSource.getContent()).toBe('Updated version')
    })
  })

  describe('when ttl is already stored in cache', () => {
    test('returns cached value when passed time < ttl', async () => {
      await cache.set('content', 'Old version', { ttl: 10 })

      await dataSource.setCache({
        key: 'content',
        update: () => Promise.resolve('Updated version'),
      })
      waitFor(5)

      expect(await dataSource.getContent()).toBe('Updated version')
    })

    test('returns current value when ttl < passed time', async () => {
      await cache.set('content', 'Old version', { ttl: 10 })
      dataSource.setContent('First version')

      await dataSource.setCache({
        key: 'content',
        update: () => Promise.resolve('Updated version'),
      })
      waitFor(15)

      expect(await dataSource.getContent()).toBe('First version')
    })
  })
})

function waitFor(seconds: number) {
  now.mockReturnValue(now() + seconds * 1000)
}
