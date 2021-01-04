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
import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'

import { user } from '../../__fixtures__'
import { createTestClient } from '../../__tests__/__utils__'
import { assertSuccessfulGraphQLMutation } from '../__utils__'
import { Service } from '~/internals/auth'

test('mutation uuid setState', async () => {
  global.client = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: user.id,
  })
  await global.pact.addInteraction({
    uponReceiving: `set state of uuid with id 1855`,
    state: `there exists a uuid with id 1855 that is not trashed`,
    withRequest: {
      method: 'POST',
      path: '/api/set-uuid-state/1855',
      body: {
        userId: user.id,
        trashed: Matchers.boolean(true),
      },
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: {
        userId: user.id,
        uuid: Matchers.eachLike({
          id: Matchers.integer(1855),
          trashed: Matchers.boolean(true),
        }),
      },
    },
  })
  await assertSuccessfulGraphQLMutation({
    mutation: gql`
      mutation uuid($input: AbstractUuidSetStateInput!) {
        uuid {
          setState(input: $input) {
            success
          }
        }
      }
    `,
    variables: { input: { id: 1855, trashed: true } },
    data: { uuid: { setState: { success: true } } },
  })
  // await assertSuccessfulGraphQLQuery({
  //   query: gql`
  //     query article($id: Int!) {
  //       uuid(id: $id) {
  //           id
  //           trashed
  //         }
  //       }
  //     }
  //   `,
  //   variables: { id: article.id },
  //   data: {
  //     uuid: { id: article.id, trashed: true },
  //   },
  // })
})
