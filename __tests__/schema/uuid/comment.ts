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

import { user } from '../../../__fixtures__/uuid'
import { comment1 } from '../../../__fixtures__/uuid/comment'
import { Service } from '../../../src/graphql/schema/types'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createTestClient,
  createUuidHandler,
} from '../../__utils__'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: user.id,
  }).client
})

test('property "createdAt"', async () => {
  global.server.use(createUuidHandler(comment1))
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query propertyCreatedAt($id: Int!) {
        uuid(id: $id) {
          ... on Comment {
            createdAt
          }
        }
      }
    `,
    variables: { id: comment1.id },
    data: {
      uuid: { createdAt: comment1.date },
    },
    client,
  })
})

test('Test property "author"', async () => {
  global.server.use(createUuidHandler(comment1))
  global.server.use(createUuidHandler(user))

  await assertSuccessfulGraphQLQuery({
    query: gql`
      query propertyCreatedAt($id: Int!) {
        uuid(id: $id) {
          ... on Comment {
            author {
              username
            }
          }
        }
      }
    `,
    variables: { id: comment1.id },
    data: {
      uuid: { author: { username: user.username } },
    },
    client,
  })
})
