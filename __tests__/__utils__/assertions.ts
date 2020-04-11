import { GraphQLResponse } from 'apollo-server-types'
import { DocumentNode, GraphQLFormattedError } from 'graphql'

import { Client } from './test-client'

export async function assertSuccessfulGraphQLQuery({
  query,
  data,
  client,
}: {
  query: DocumentNode
  data: GraphQLResponse['data']
  client: Client
}) {
  const response = await client.query({
    query,
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual(data)
}

export async function assertSuccessfulGraphQLMutation({
  mutation,
  client,
}: {
  mutation: DocumentNode
  client: Client
}) {
  const response = await client.mutate({
    mutation,
  })
  expect(response.errors).toBeUndefined()
}

export async function assertFailingGraphQLMutation(
  {
    mutation,
    client,
  }: {
    mutation: DocumentNode
    client: Client
  },
  assert: (errors: readonly GraphQLFormattedError[]) => void
) {
  const response = await client.mutate({
    mutation,
  })
  assert(response.errors!)
}
