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

import { article, user } from '../../../__fixtures__'
import { given, givenUuids, Client, givenUuid, nextUuid } from '../../__utils__'

const mutation = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    mutation set($input: AddRevisionInput!) {
      entity {
        addRevision(input: $input) {
          success
        }
      }
    }
  `,
})

const input = {
  changes: 'changes',
  content: 'content',
  entityId: article.id,
  needsReview: true,
  subscribeThis: false,
  subscribeThisByEmail: false,
  title: 'title',
}

beforeEach(() => {
  givenUuids(user, article)
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  given('EntityAddRevision')
    .withPayload({
      ...input,
      userId: user.id,
    })
    .returns({ success: true })

  await mutation
    .withVariables({ input })
    .shouldReturnData({ entity: { addRevision: { success: true } } })
})

test('updates the cache', async () => {
  // TODO
})

test('fails when user is not authenticated', async () => {
  await mutation
    .withVariables({ input })
    .forUnauthenticatedUser()
    .shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "login"', async () => {
  const guestUser = { ...user, id: nextUuid(user.id), roles: ['guest'] }

  givenUuid(guestUser)

  await new Client({ userId: guestUser.id })
    .prepareQuery({
      query: gql`
        mutation set($input: AddRevisionInput!) {
          entity {
            addRevision(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withVariables({ input })
    .shouldFailWithError('FORBIDDEN')
})

test('fails when database layer returns a 400er response', async () => {
  given('EntityAddRevision').returnsBadRequest()

  await mutation.withVariables({ input }).shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('EntityAddRevision').hasInternalServerError()

  await mutation
    .withVariables({ input })
    .shouldFailWithError('INTERNAL_SERVER_ERROR')
})
