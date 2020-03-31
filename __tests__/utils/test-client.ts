import { ApolloServer } from 'apollo-server'
import {
  ApolloServerTestClient,
  createTestClient as createApolloTestClient,
} from 'apollo-server-testing'

import { createInMemoryCache } from '../../src/cache/in-memory-cache'
import { getGraphQLOptions } from '../../src/graphql'
import { Cache } from '../../src/graphql/environment'

export type Client = ApolloServerTestClient
export function createTestClient(context: {}): {
  cache: Cache
  client: Client
} {
  const cache = createInMemoryCache()
  const server = new ApolloServer({
    ...getGraphQLOptions({
      cache,
    }),
    context() {
      return { ...context }
    },
  })
  return { cache, client: createApolloTestClient(server) }
}
