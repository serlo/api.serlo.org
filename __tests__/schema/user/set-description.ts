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
import { given, Client } from '../../__utils__'

const mutation = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    mutation ($input: UserSetDescriptionInput!) {
      user {
        setDescription(input: $input) {
          success
        }
      }
    }
  `,
  variables: { input: { description: 'description' } },
})

beforeEach(() => {
  given('UuidQuery').for(user)
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  given('UserSetDescriptionMutation')
    .withPayload({ userId: user.id, description: 'description' })
    .returns({ success: true })

  await mutation.shouldReturnData({
    user: { setDescription: { success: true } },
  })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when database layer returns a 400er response', async () => {
  given('UserSetDescriptionMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('UserSetDescriptionMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})

test('updates the cache', async () => {
  const query = new Client({ userId: user.id }).prepareQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          ... on User {
            description
          }
        }
      }
    `,
    variables: { id: user.id },
  })

  await query.shouldReturnData({ uuid: { description: null } })

  given('UserSetDescriptionMutation')
    .withPayload({ userId: user.id, description: 'description' })
    .returns({ success: true })

  await mutation.execute()

  await query.shouldReturnData({ uuid: { description: 'description' } })
})
