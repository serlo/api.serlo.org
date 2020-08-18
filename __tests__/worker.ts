import CacheWorker from '../src/worker'
import { getGraphQLOptions } from '../src/graphql'
import { ApolloServer } from 'apollo-server-express'
import { createInMemoryCache } from '../src/cache/in-memory-cache'
import { graphql, rest } from 'msw'
import { GraphQLRequest } from 'apollo-server-types'
import { Service } from '../src/graphql/schema/types'

const cache = createInMemoryCache()

const mockKeysValues: Map<string, string> = new Map([
  ['uuid', 'value1'],
  ['license', 'value1'],
  ['authors', 'value1'],
  ['ble', 'value1'],
  ['foo', 'value1'],
  ['bar.fuss', 'value1'],
  ['exam', 'value1'],
  ['map', 'value1'],
  ['blablabla', 'value1'],
  ['blebleble', 'value1'],
  ['eleven', 'value1'],
  ['twelve', 'value1'],
  ['thirteen', 'value1'],
  ['14', 'value1'],
  ['15', 'value1'],
  ['16', 'value1'],
  ['17', 'value1'],
  ['18', 'value1'],
  ['19', 'value1'],
  ['20', 'value1'],
  ['21', 'value1'],
])

let worker: CacheWorker

let server: ApolloServer

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
    apiEndpoint: 'https://api.serlo.org/graphql',
    service: Service.Serlo,
    secret: 'blllkjadf',
  })

  
  const serloApi = graphql.link('https://api.serlo.org/graphql')

  global.server.use(
    // rest.post('https://api.serlo.org/graphql', async (req, res, ctx) => {
    //   // console.log(req)
    //   return res(
    //     ctx.json(
    //       await server.executeOperation({
    //         query: worker.queryLiteral,
    //       } as GraphQLRequest)
    //     )
    //   )
    // }),
    // rest.get(
    //   `http://de.${process.env.SERLO_ORG_HOST}/api/${[...mockKeysValues.keys()][0]}`,
    //   (req, res, ctx) => {
    //     return res(ctx.status(200), ctx.json(mockKeysValues.get('uuid')! as any))
    //   }
    // ),
    serloApi.query('nlo', async(req, res, ctx) =>{
      return res(
        ctx.data(
          await server.executeOperation({
            query: worker.queryLiteral,
          } as GraphQLRequest)
        )
      )
    })
  )
})

describe('Update-cache worker', () => {
  test('updates the whole cache', async () => {
    //console.log('cache.get(mockKeysValues.get: ', await cache.get(mockKeysValues.get('de.serlo.org/api/uuid')!))
    await worker.updateWholeCache()
  })
})
