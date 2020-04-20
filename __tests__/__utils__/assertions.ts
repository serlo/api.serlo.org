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
  variables,
  client,
}: {
  mutation: DocumentNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: Record<string, any>
  client: Client
}) {
  const response = await client.mutate({
    mutation,
    variables,
  })
  expect(response.errors).toBeUndefined()
}

export async function assertFailingGraphQLMutation(
  {
    mutation,
    variables,
    client,
  }: {
    mutation: DocumentNode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables?: Record<string, any>
    client: Client
  },
  assert: (errors: readonly GraphQLFormattedError[]) => void
) {
  const response = await client.mutate({
    mutation,
    variables,
  })
  assert(response.errors!)
}
