import { ApolloServer, gql } from 'apollo-server'
import { createTestClient } from 'apollo-server-testing'

import { createInMemoryCache } from '../src/cache/in-memory-cache'
import { getGraphQLOptions } from '../src/graphql'

const cache = createInMemoryCache()
const server = new ApolloServer(
  getGraphQLOptions({
    cache,
  })
)
const client = createTestClient(server)

let mocks: Record<string, unknown> = {}

jest.mock('apollo-datasource-rest', () => {
  class MockRESTDataSource {
    protected get(path: string) {
      return mocks[path.replace('http://localhost:9009', '')]
    }
  }
  return { RESTDataSource: MockRESTDataSource }
})

beforeEach(() => {
  cache.reset()
  mocks = {}
})

describe('Entity', () => {
  describe('Article', () => {
    test('by alias', async () => {
      await cache.set(
        'de.serlo.org/api/alias/mathe/funktionen/uebersicht-aller-artikel-zu-funktionen/parabel',
        JSON.stringify({
          id: 1855,
          source: '/entity/view/1855',
          timestamp: '2014-06-16T15:58:45Z',
        })
      )
      await cache.set(
        'de.serlo.org/api/uuid/1855',
        JSON.stringify({
          id: 1855,
          trashed: false,
          discriminator: 'entity',
          type: 'article',
          instance: 'de',
          date: '2014-03-01T20:45:56Z',
          currentRevisionId: 30674,
          licenseId: 1,
          taxonomyTermIds: 5,
        })
      )
      const response = await client.query({
        query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "/mathe/funktionen/uebersicht-aller-artikel-zu-funktionen/parabel"
              }
            ) {
              __typename
              ... on Article {
                id
                trashed
                instance
                date
                currentRevision {
                  id
                }
                license {
                  id
                }
              }
            }
          }
        `,
      })
      expect(response.errors).toBe(undefined)
      expect(response.data).toEqual({
        uuid: {
          __typename: 'Article',
          trashed: false,
          id: 1855,
          instance: 'de',
          date: '2014-03-01T20:45:56Z',
          currentRevision: {
            id: 30674,
          },
          license: {
            id: 1,
          },
        },
      })
    })

    test('by id (updating cache)', async () => {
      await cache.set(
        'de.serlo.org/api/uuid/1855',
        JSON.stringify({
          id: 1855,
          trashed: false,
          discriminator: 'entity',
          type: 'article',
          instance: 'de',
          date: '2014-03-01T20:45:56Z',
          currentRevisionId: 30674,
          licenseId: 1,
          taxonomyTermIds: 5,
        })
      )
      let response = await client.query({
        query: gql`
          {
            uuid(id: 1855) {
              __typename
              ... on Article {
                id
                trashed
                instance
                date
                currentRevision {
                  id
                }
                license {
                  id
                }
              }
            }
          }
        `,
      })
      expect(response.errors).toBe(undefined)
      expect(response.data).toEqual({
        uuid: {
          __typename: 'Article',
          trashed: false,
          id: 1855,
          instance: 'de',
          date: '2014-03-01T20:45:56Z',
          currentRevision: {
            id: 30674,
          },
          license: {
            id: 1,
          },
        },
      })
      mocks['/api/uuid/1855'] = {
        id: 1855,
        trashed: false,
        discriminator: 'entity',
        type: 'article',
        instance: 'de',
        date: '2014-03-01T20:45:56Z',
        currentRevisionId: 30675,
        licenseId: 1,
        taxonomyTermIds: 5,
      }
      response = await client.mutate({
        mutation: gql`
          mutation {
            updateUuidCache(id: 1855) {
              ... on Article {
                currentRevision {
                  id
                }
              }
            }
          }
        `,
      })
      expect(response.errors).toBe(undefined)
      expect(response.data).toEqual({
        updateUuidCache: {
          currentRevision: {
            id: 30675,
          },
        },
      })
    })
  })
})
