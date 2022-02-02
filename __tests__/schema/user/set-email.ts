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

import { user as baseUser } from '../../../__fixtures__'
import { givenUuid, Client, given } from '../../__utils__'

const user = { ...baseUser, roles: ['sysadmin'] }
const query = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    mutation ($input: UserSetEmailInput!) {
      user {
        setEmail(input: $input) {
          success
          username
          email
        }
      }
    }
  `,
  variables: { input: { userId: user.id, email: 'user@example.org' } },
})

beforeEach(() => {
  givenUuid(user)
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  given('UserSetEmailMutation')
    .withPayload({ userId: user.id, email: 'user@example.org' })
    .returns({ success: true, username: user.username })

  await query.shouldReturnData({
    user: {
      setEmail: {
        success: true,
        username: user.username,
        email: 'user@example.org',
      },
    },
  })
})

test('fails when user is not authenticated', async () => {
  await query.withUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "sysadmin"', async () => {
  givenUuid({ ...user, roles: ['login', 'de_admin'] })

  await query.shouldFailWithError('FORBIDDEN')
})

test('fails when database layer returns a 400er response', async () => {
  given('UserSetEmailMutation').returnsBadRequest()

  await query.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('UserSetEmailMutation').hasInternalServerError()

  await query.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
