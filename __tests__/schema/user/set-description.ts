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
import { createTestClient, given, Query, givenUuid } from '../../__utils__'

const query = new Query({
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
  client: createTestClient({ userId: user.id }),
})

beforeEach(() => {
  givenUuid(user)
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  given('UserSetDescriptionMutation')
    .withPayload({ userId: user.id, description: 'description' })
    .returns({ success: true })

  await query.shouldReturnData({ user: { setDescription: { success: true } } })
})

test('fails when user is not authenticated', async () => {
  await query.withUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when database layer returns a 400er response', async () => {
  given('UserSetDescriptionMutation').returnsBadRequest()

  await query.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('UserSetDescriptionMutation').hasInternalServerError()

  await query.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
