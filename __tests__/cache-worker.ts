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
import { ApolloServer } from 'apollo-server-express'
import { GraphQLRequest } from 'apollo-server-types'
import { graphql, rest } from 'msw'

import { CacheWorker } from '../cache-worker/src/cache-worker'
import { createInMemoryCache } from '../src/cache/in-memory-cache'
import { getGraphQLOptions } from '../src/graphql'
import { Service } from '../src/graphql/schema/types'

const mockKeysValues = new Map(
  [...Array(25).keys()].map((x) => [`de.serlo.org/api/key${x}`, `"value${x}"`])
)

let cacheWorker: CacheWorker

let server: ApolloServer
const cache = createInMemoryCache()

const fakeSerloDataSourceResponses = [...mockKeysValues.keys()].map((key) => {
  return rest.get(
    `http://de.${process.env.SERLO_ORG_HOST}/api/${key.slice(
      'de.serlo.org/api/'.length
    )}`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(JSON.parse(mockKeysValues.get(key)!))
      )
    }
  )
})

const apiEndpoint = 'https://api.serlo.org/graphql'

const serloApi = graphql.link(apiEndpoint)

beforeEach(async () => {
  await cache.set('de.serlo.org/api/cache-keys', [...mockKeysValues.keys()])
  server = new ApolloServer({
    ...getGraphQLOptions({ cache }),
    context: {
      service: Service.Serlo,
      user: null,
    },
  })
  cacheWorker = new CacheWorker({
    apiEndpoint: apiEndpoint,
    service: Service.Serlo,
    secret: 'blllkjadf',
    pagination: 10, // default is 100, 10 is just for making less overhead by testing
  })

  global.server.use(
    serloApi.mutation('_updateCache', async (_req, res, ctx) => {
      return res(
        ctx.data(
          await server.executeOperation({
            query: cacheWorker.getUpdateCacheRequest(),
          } as GraphQLRequest)
        )
      )
    }),
    ...fakeSerloDataSourceResponses
  )
})

describe('Update-cache worker', () => {
  test('successfully calls _updateCache', async () => {
    await cacheWorker.update([...mockKeysValues.keys()])
    expect(cacheWorker.errLog).toEqual([])
  })
  test('does not crash if _updateCache does not work', async () => {
    global.server.use(
      serloApi.mutation('_updateCache', () => {
        throw new Error('Something went wrong at _updateCache, but be cool')
      })
    )
    await cacheWorker.update([...mockKeysValues.keys()])
    expect(cacheWorker.errLog[0].message).toContain(
      'Something went wrong at _updateCache, but be cool'
    )
    expect(cacheWorker.okLog.length).toEqual(0)
  })
  test('does not crash if a cache value does not get updated for some reason', async () => {
    global.server.use(
      serloApi.mutation('_updateCache', async (req, res, ctx) => {
        if (req.body?.query.includes('key20')) {
          throw new Error(
            'Something went wrong while updating value of "de.serlo.org/api/key20", but keep calm'
          )
        }
        return res(
          ctx.data(
            await server.executeOperation({
              query: cacheWorker.getUpdateCacheRequest(),
            } as GraphQLRequest)
          )
        )
      })
    )
    await cacheWorker.update([...mockKeysValues.keys()])
    expect(cacheWorker.errLog[0].message).toContain(
      'Something went wrong while updating value of "de.serlo.org/api/key20", but keep calm'
    )
  })
  test('successfully updates only some values', async () => {
    await cacheWorker.update([
      'de.serlo.org/api/key0',
      'de.serlo.org/api/key7',
      'de.serlo.org/api/key10',
      'de.serlo.org/api/key20',
    ])
    expect(cacheWorker.errLog).toEqual([])
  })
  test('does not crash even though it had a problem with some values', async () => {
    await cacheWorker.update([
      'de.serlo.org/api/key0',
      'de.serlo.org/api/keyInexistent',
      'de.serlo.org/api/key10',
      'de.serlo.org/api/keyWrong',
    ])
    expect(cacheWorker.errLog).not.toEqual([])
  })
})
