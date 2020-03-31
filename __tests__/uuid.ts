import { gql } from 'apollo-server'

import { Cache } from '../src/graphql/environment'
import { Client, createTestClient } from './utils/test-client'

let mocks: Record<string, unknown> = {}

jest.mock('apollo-datasource-rest', () => {
  class MockRESTDataSource {
    protected get(path: string) {
      return mocks[path.replace('http://localhost:9009', '')]
    }
  }
  return { RESTDataSource: MockRESTDataSource }
})

let env: { cache: Cache; client: Client }

beforeEach(() => {
  env = createTestClient({ service: null })
  mocks = {}
})

describe('Entity', () => {
  describe('Article', () => {
    test('by alias', async () => {
      await env.cache.set(
        'de.serlo.org/api/alias/mathe/funktionen/uebersicht-aller-artikel-zu-funktionen/parabel',
        JSON.stringify({
          id: 1855,
          source: '/entity/view/1855',
          timestamp: '2014-06-16T15:58:45Z',
        })
      )
      await env.cache.set(
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
      const response = await env.client.query({
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
  })
})
