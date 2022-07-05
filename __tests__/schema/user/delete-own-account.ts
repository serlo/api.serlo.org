/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */

import { gql } from 'apollo-server'

import { user } from '../../../__fixtures__'
import { Client, given, Query } from '../../__utils__'

let client: Client
let mutation: Query

beforeEach(() => {
  client = new Client({ userId: user.id })

  mutation = client.prepareQuery({
    query: gql`
      mutation {
        user {
          deleteOwnAccount {
            success
          }
        }
      }
    `,
  })

  given('UserDeleteRegularUsersMutation')
    .withPayload({ userId: user.id })
    .returns({ success: true })
})

test('runs successfully when mutation could be successfully executed', async () => {
  await mutation.shouldReturnData({
    user: { deleteOwnAccount: { success: true } },
  })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when database layer has an internal error', async () => {
  given('UserDeleteRegularUsersMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
