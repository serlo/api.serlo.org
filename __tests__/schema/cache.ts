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
import { assertSuccessfulGraphQLMutation } from '../__utils__/assertions'
import { createTestClient } from '../__utils__/test-client'

// We should add a test that checks that any other service than Serlo leads to a FORBIDDEN error
test.todo('_setCache (forbidden)')

test('_setCache (authenticated)', async () => {
  const { client, cache, serializer } = createTestClient({
    service: Service.Serlo,
    user: null,
  })
  const key = 'foo'
  // The value to cache
  const value = { foo: 'bar' }

  // Do the mutation
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

  // Assert that the cache got changed successfully.
  const serializedCachedValue = await cache.get(key)
  const cachedValue = await serializer.deserialize(serializedCachedValue!)
  expect(cachedValue).toEqual(value)
})

test.todo('_removeCache (forbidden)')
test.todo('_removeCache (authenticated)')
