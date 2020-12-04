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
import { CacheableDataSource } from '../../src/graphql/data-sources'
import { Cache, Timer } from '../../src/graphql/environment'
import { createInMemoryCache } from '../../src/legacy-cache'

class ExampleDataSource extends CacheableDataSource {
  public async getContent({ key = 'key', current, maxAge }: CachePayload) {
    return await this.getCacheValue({
      key,
      update: () => Promise.resolve(current),
      maxAge,
    })
  }

  public updateCacheValue(_key: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

interface CachePayload {
  key?: string
  current: number
  maxAge?: number
}

let cache: Cache
let dataSource: ExampleDataSource
const now = jest.fn<number, never>()
const timer: Timer = { now }

beforeEach(() => {
  now.mockReturnValue(Date.now())
  cache = createInMemoryCache(timer)
  dataSource = new ExampleDataSource({
    cache,
    timer,
  })
})

describe('getCacheValue', () => {
  describe('cold cache', () => {
    test('fills cache and returns current value', async () => {
      expect(await dataSource.getContent({ current: 0 })).toEqual(0)
    })
  })

  describe('warm cache', () => {
    describe('maxAge = undefined', () => {
      test('returns cached value without background update', async () => {
        await initCache({ current: 0 })
        await waitFor(10)
        expect(await dataSource.getContent({ current: 1 })).toEqual(0)
        expect(await dataSource.getContent({ current: 2 })).toEqual(0)
      })
    })

    describe('maxAge > 0', () => {
      test('passed time < maxAge: returns cached value without background update', async () => {
        const maxAge = 10
        await initCache({ current: 0, maxAge })
        await waitFor(5)
        expect(await dataSource.getContent({ current: 1, maxAge })).toEqual(0)
        expect(await dataSource.getContent({ current: 2, maxAge })).toEqual(0)
      })

      test('maxAge < passed time: returns cached value with background update', async () => {
        const maxAge = 10
        await initCache({ current: 0, maxAge })
        await waitFor(20)
        expect(await dataSource.getContent({ current: 1, maxAge })).toEqual(0)
        expect(await dataSource.getContent({ current: 2, maxAge })).toEqual(1)
      })
    })
  })

  describe('lock', () => {
    test('is acquired by first update and unlocked when background task is done', async () => {
      const maxAge = 10
      await initCache({ current: 0, maxAge })
      await waitFor(20)
      expect(
        await Promise.all([
          dataSource.getContent({ current: 1, maxAge }),
          dataSource.getContent({ current: 2, maxAge }),
        ])
      ).toEqual([0, 0])
      expect(await dataSource.getContent({ current: 3, maxAge })).toEqual(1)
    })

    test('only affects the same key', async () => {
      const maxAge = 10
      await initCache({ key: 'a', current: 0, maxAge })
      await initCache({ key: 'b', current: 5, maxAge })
      await waitFor(20)
      expect(
        await Promise.all([
          dataSource.getContent({ key: 'a', current: 1, maxAge }),
          dataSource.getContent({ key: 'b', current: 6, maxAge }),
        ])
      ).toEqual([0, 5])
      expect(
        await Promise.all([
          dataSource.getContent({ key: 'a', current: 2, maxAge }),
          dataSource.getContent({ key: 'b', current: 7, maxAge }),
        ])
      ).toEqual([1, 6])
    })

    test('is unlocked when update fails', async () => {
      const maxAge = 10
      await initCache({ key: 'key', current: 0, maxAge })
      await waitFor(20)
      await dataSource.setCacheValue({
        key: 'key',
        update: () => {
          throw new Error('Update fails')
        },
      })
      expect(await dataSource.getContent({ current: 1, maxAge })).toEqual(0)
      expect(await dataSource.getContent({ current: 2, maxAge })).toEqual(1)
    })
  })

  describe('legacy cache values', () => {
    test('passed time < maxAge: returns legacy value without background update', async () => {
      await cache.set('key', 0)
      expect(await dataSource.getContent({ current: 1 })).toEqual(0)
      expect(await dataSource.getContent({ current: 2 })).toEqual(0)
    })

    test('maxAge < passed time: returns legacy value with background update', async () => {
      const maxAge = 10
      await cache.set('key', 0)
      expect(await dataSource.getContent({ current: 1, maxAge })).toEqual(0)
      await waitFor(20)
      expect(await dataSource.getContent({ current: 2, maxAge })).toEqual(0)
      expect(await dataSource.getContent({ current: 3 })).toEqual(2)
    })
  })
})

describe('setCacheValue', () => {
  test('updates cached value', async () => {
    await dataSource.setCacheValue({
      key: 'key',
      update: () => Promise.resolve(0),
    })
    expect(await dataSource.getContent({ current: 1 })).toEqual(0)
  })
  test('update function can use current value', async () => {
    await initCache({ current: 5 })
    await dataSource.setCacheValue<number>({
      key: 'key',
      update: (current) => Promise.resolve((current || 0) + 1),
    })
    expect(await dataSource.getContent({ current: 10 })).toEqual(6)
  })
})

async function initCache(payload: CachePayload) {
  await dataSource.getContent(payload)
}

// We make this synchronous function asynchronous just to make clear that this would be asynchronous in production.
// eslint-disable-next-line @typescript-eslint/require-await
async function waitFor(seconds: number) {
  now.mockReturnValue(now() + seconds * 1000)
}
