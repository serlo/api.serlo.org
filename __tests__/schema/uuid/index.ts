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

import { taxonomyTermRoot, article } from '../../../__fixtures__'
import { Service } from '../../../src/graphql/schema/types'
import {
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
  describe('returns alias encoded', () => {
    test('TaxonomyTerm', async () => {
      await doTestWithUuid(taxonomyTermRoot)
    })

    test('AbstractRepository', async () => {
      await doTestWithUuid(article)
    })

    // TODO: I need to fix the type of uuid here
    async function doTestWithUuid(
      uuid: typeof article | typeof taxonomyTermRoot
    ) {
      global.server.use(createUuidHandler({ ...uuid, alias: '/ü/ä' }))

      await assertSuccessfulGraphQLQuery({
        query: gql`
          query getAliasOf($id: Int!) {
            uuid(id: $id) {
              ... on AbstractRepository {
                alias
              }
              ... on TaxonomyTerm {
                alias
              }
            }
          }
        `,
        variables: { id: uuid.id },
        data: {
          uuid: {
            alias: '/%C3%BC/%C3%A4',
          },
        },
        client,
      })
    }
  })

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

  test('returns null when no arguments are given', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query emptyUuidRequest {
          uuid {
            __typename
          }
        }
      `,
      data: {
        uuid: null,
      },
      client,
    })
  })
})
