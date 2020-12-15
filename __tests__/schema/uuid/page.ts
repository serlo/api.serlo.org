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

import {
  page,
  pageRevision,
  getPageDataWithoutSubResolvers,
  getPageRevisionDataWithoutSubResolvers,
  license,
} from '../../../__fixtures__'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createLicenseHandler,
  createTestClient,
  createUuidHandler,
} from '../../__utils__'
import { Service } from '~/internals/auth'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: null,
  })
})

describe('Page', () => {
  beforeEach(() => {
    global.server.use(createUuidHandler(page))
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query page($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on Page {
              id
              trashed
              instance
              date
            }
          }
        }
      `,
      variables: page,
      data: {
        uuid: getPageDataWithoutSubResolvers(page),
      },
      client,
    })
  })

  test('by id (w/ license)', async () => {
    global.server.use(createLicenseHandler(license))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query page($id: Int!) {
          uuid(id: $id) {
            ... on Page {
              license {
                id
                instance
                default
                title
                url
                content
                agreement
                iconHref
              }
            }
          }
        }
      `,
      variables: page,
      data: {
        uuid: {
          license,
        },
      },
      client,
    })
  })
})

test('PageRevision', async () => {
  global.server.use(createUuidHandler(pageRevision))
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query pageRevision($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on PageRevision {
            id
            trashed
            title
            content
            date
          }
        }
      }
    `,
    variables: pageRevision,
    data: {
      uuid: getPageRevisionDataWithoutSubResolvers(pageRevision),
    },
    client,
  })
})
