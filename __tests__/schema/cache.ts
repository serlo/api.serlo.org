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
import { gql } from 'apollo-server'

import { Service } from '../../src/graphql/schema/types'
import {
  assertSuccessfulGraphQLMutation,
  assertFailingGraphQLMutation,
} from '../__utils__/assertions'
import { createTestClient } from '../__utils__/test-client'

test('_setCache (forbidden)', async () => {
  const { client } = createTestClient({
    service: Service.Playground,
    user: null,
  })

  const key = 'foo'
  const value = { foo: 'bar' }

  await assertFailingGraphQLMutation(
    {
      mutation: gql`
        mutation setCache($key: String!, $value: String!) {
          _setCache(key: $key, value: $value)
        }
      `,
      variables: {
        key,
        value: JSON.stringify(value),
      },
      client,
    },
    (errors) => {
      expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
    }
  )
})

test('_setCache (authenticated)', async () => {
  const { client, cache, serializer } = createTestClient({
    service: Service.Serlo,
    user: null,
  })
  const key = 'foo'
  const value = { foo: 'bar' }

  await assertSuccessfulGraphQLMutation({
    mutation: gql`
      mutation setCache($key: String!, $value: String!) {
        _setCache(key: $key, value: $value)
      }
    `,
    variables: {
      key,
      // The consumer of the API should pass the value as a JSON-stringified string
      value: JSON.stringify(value),
    },
    client,
  })

  const serializedCachedValue = await cache.get(key)
  const cachedValue = await serializer.deserialize(serializedCachedValue!)
  expect(cachedValue).toEqual(value)
})

test('_removeCache (forbidden)', async () => {
  const { client } = createTestClient({
    service: Service.Playground,
    user: null,
  })
  await assertFailingGraphQLMutation(
    {
      mutation: gql`
        mutation {
          _removeCache(key: "foo")
        }
      `,
      client,
    },
    (errors) => {
      expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
    }
  )
})

test('_removeCache (authenticated)', async () => {
  const { client, cache, serializer } = createTestClient({
    service: Service.Serlo,
    user: null,
  })
  const key = 'foo'

  await assertSuccessfulGraphQLMutation({
    mutation: gql`
      mutation removeCache($key: String!) {
        _removeCache(key: $key)
      }
    `,
    variables: {
      key,
    },
    client,
  })

  const serializedCachedValue = await cache.get(key)
  const cachedValue = await serializer.deserialize(serializedCachedValue!)
  expect(cachedValue).toEqual(null)
})
