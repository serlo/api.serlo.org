/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'

import { article, articleRevision, user } from '../../__fixtures__'
import {
  assertErrorEvent,
  assertFailingGraphQLQuery,
  assertSuccessfulGraphQLQuery,
  createMessageHandler,
  createTestClient,
  createUuidHandler,
  getTypenameAndId,
} from '../__utils__'

const invalidValue = { __typename: 'Article', invalid: 'this in invalid' }

test('invalid values from data sources are reported', async () => {
  const client = createTestClient()

  global.server.use(
    createMessageHandler({
      message: { type: 'UuidQuery', payload: { id: 42 } },
      body: invalidValue,
    })
  )

  await assertFailingGraphQLQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          __typename
        }
      }
    `,
    variables: { id: 42 },
    client,
  })

  await assertErrorEvent({
    message: 'Invalid value received from data source.',
    fingerprint: ['invalid-value', 'data-source', JSON.stringify(invalidValue)],
    errorContext: {
      invalidCurrentValue: invalidValue,
      key: 'de.serlo.org/api/uuid/42',
    },
  })
})

describe('reports invalid cache values', () => {
  test('when cache value has invalid properties', async () => {
    const key = `de.serlo.org/api/uuid/${user.id}`
    global.server.use(createUuidHandler(user))
    global.timer.setCurrentTime(1000)
    await global.cache.set({ key, value: invalidValue, source: 'unit-test' })

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            __typename
            id
          }
        }
      `,
      variables: { id: user.id },
      data: { uuid: getTypenameAndId(user) },
      client: createTestClient(),
    })

    await assertErrorEvent({
      message:
        'Invalid cached value received that could be repaired automatically by data source.',
      errorContext: {
        invalidCacheValue: invalidValue,
        currentValue: user,
        timeInvalidCacheSaved: new Date(1000).toISOString(),
        key,
        source: 'unit-test',
      },
      fingerprint: ['invalid-value', 'cache', key],
    })
  })

  test('when cache value is null but shall not be null', async () => {
    const key = `de.serlo.org/api/uuid/${article.currentRevisionId ?? ''}`
    global.server.use(
      createUuidHandler(article),
      createUuidHandler(articleRevision)
    )
    await global.cache.set({ key, value: null, source: 'unit-test' })

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on Article {
              currentRevision {
                __typename
                id
              }
            }
          }
        }
      `,
      variables: { id: article.id },
      data: { uuid: { currentRevision: getTypenameAndId(articleRevision) } },
      client: createTestClient(),
    })

    await assertErrorEvent({
      message:
        'Invalid cached value received that could be repaired automatically by data source.',
      errorContext: { invalidCacheValue: null },
    })
  })
})
