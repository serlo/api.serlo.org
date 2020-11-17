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

import { taxonomyTermRoot } from '../../../__fixtures__'
import { Service } from '../../../src/graphql/schema/types'
import {
  assertFailingGraphQLQuery,
  assertSuccessfulGraphQLQuery,
  Client,
  createTestClient,
  createUuidHandler,
  createJsonHandler,
} from '../../__utils__'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: null,
  }).client
})

describe('uuid', () => {
  test('can handle decoded alias with percent signs', async () => {
    global.server.use(
      createUuidHandler({ ...taxonomyTermRoot, alias: '/math/%%x%%' })
    )

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query aliasOfTaxonomyTerm($id: Int!) {
          uuid(id: $id) {
            ... on TaxonomyTerm {
              alias
            }
          }
        }
      `,
      variables: { id: taxonomyTermRoot.id },
      data: {
        uuid: {
          alias: '/math/%25%25x%25%25',
        },
      },
      client,
    })
  })

  test('returns null when alias cannot be found', async () => {
    global.server.use(
      createJsonHandler({
        path: '/api/alias/not-existing',
        body: null,
      })
    )

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notExistingUuid($alias: AliasInput) {
          uuid(alias: $alias) {
            __typename
          }
        }
      `,
      variables: { alias: { instance: 'de', path: '/not-existing' } },
      data: { uuid: null },
      client,
    })
  })

  test('returns null when uuid does not exist', async () => {
    global.server.use(createJsonHandler({ path: '/api/uuid/666', body: null }))

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query requestNonExistingUuid($id: Int!) {
          uuid(id: $id) {
            __typename
          }
        }
      `,
      variables: { id: 666 },
      data: {
        uuid: null,
      },
      client,
    })
  })

  test('returns an error when no arguments are given', async () => {
    await assertFailingGraphQLQuery({
      query: gql`
        query emptyUuidRequest {
          uuid {
            __typename
          }
        }
      `,
      message: 'you need to provide an id or an alias',
      client,
    })
  })

  test("returns an error when the path does not start with '/'", async () => {
    await assertFailingGraphQLQuery({
      query: gql`
        query emptyUuidRequest {
          uuid(alias: { instance: de, path: "mathe" }) {
            __typename
          }
        }
      `,
      message:
        "First is the worst, please add a '/' at the beginning of your path",
      client,
    })
  })
})
