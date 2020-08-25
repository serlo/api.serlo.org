import { ApolloServer } from 'apollo-server-express'
import { GraphQLRequest } from 'apollo-server-types'
import { graphql, rest } from 'msw'

import { CacheWorker } from '../cache-worker/src/worker'
import { createInMemoryCache } from '../src/cache/in-memory-cache'
import { getGraphQLOptions } from '../src/graphql'
import { Service } from '../src/graphql/schema/types'

const mockKeysValues = new Map(
  [...Array(25).keys()].map((x) => [`de.serlo.org/api/key${x}`, `value${x}`])
)

let worker: CacheWorker

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
  worker = new CacheWorker({
    apiEndpoint: apiEndpoint,
    service: Service.Serlo,
    secret: 'blllkjadf',
  })

  global.server.use(
    serloApi.query('_cacheKeys', async (_req, res, ctx) => {
      return res(
        ctx.data(
          await server.executeOperation({
            query: worker.getQueryRequest(),
          } as GraphQLRequest)
        )
      )
    }),
    serloApi.mutation('_updateCache', async (_req, res, ctx) => {
      return res(
        ctx.data(
          await server.executeOperation({
            query: worker.getMutationRequest(),
          } as GraphQLRequest)
        )
      )
    }),
    ...fakeSerloDataSourceResponses
  )
})

describe('Update-cache worker', () => {
  test('successfuly calls _cacheKeys and _updateCache', async () => {
    await worker.updateWholeCache()
    // TODO double check if the cache was indeed updated
  })
  test('does not fail if _updateCache does not work', async () => {
    global.server.use(
      serloApi.mutation('_updateCache', () => {
        throw new Error('Something went wrong at _updateCache, but be cool')
      })
    )
    await worker.updateWholeCache()
  })
  test('does not fail if a cache key does not get updated for some reason', async () => {
    global.server.use(
      serloApi.mutation('_updateCache', async (req, res, ctx) => {
        if (req.body?.query.includes('key20')) {
          throw new Error(
            'Something went wrong while updating value of "key20", but keep calm'
          )
        }
        return res(
          ctx.data(
            await server.executeOperation({
              query: worker.getMutationRequest(),
            } as GraphQLRequest)
          )
        )
      })
    )
    await worker.updateWholeCache()
  })
})
