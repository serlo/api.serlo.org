/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { GraphQLResponse } from 'apollo-server-types'
import { DocumentNode, GraphQLFormattedError } from 'graphql'

import { Client } from './test-client'

export async function assertSuccessfulGraphQLQuery({
  query,
  variables,
  data,
  client,
}: {
  query: string | DocumentNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: Record<string, any>
  data: GraphQLResponse['data']
  client: Client
}) {
  const response = await client.query({
    query,
    variables,
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual(data)
}

export async function assertFailingGraphQLQuery({
  query,
  variables,
  client,
  message,
}: {
  query: string | DocumentNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: Record<string, any>
  client: Client
  message?: unknown
}) {
  const response = await client.query({
    query,
    variables,
  })
  expect(response.errors).toBeDefined()

  if (message)
    expect(response.errors?.map((error) => error.message)).toContainEqual(
      message
    )
}

export async function assertSuccessfulGraphQLMutation({
  mutation,
  variables,
  data,
  client,
}: {
  mutation: DocumentNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: Record<string, any>
  data?: GraphQLResponse['data']
  client: Client
}) {
  const response = await client.mutate({
    mutation,
    variables,
  })
  expect(response.errors).toBeUndefined()
  if (data !== undefined) expect(response.data).toEqual(data)
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
