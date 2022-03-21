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

import { page, user as baseUser } from '../../../__fixtures__'
import { given, Client, nextUuid } from '../../__utils__'

const user = { ...baseUser, roles: ['de_static_pages_builder'] }

describe('PageAddRevisionMutation', () => {
  const input = {
    content: 'content',
    title: 'title',
    pageId: page.id,
  }

  const mutation = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation set($input: PageAddRevisionInput!) {
          page {
            addRevision(input: $input) {
              success
              revisionId
            }
          }
        }
      `,
    })
    .withVariables({ input })

  beforeEach(() => {
    given('UuidQuery').for(user, page)
  })

  test('returns "{ success: true }" when mutation could be successfully executed', async () => {
    given('PageAddRevisionMutation')
      .withPayload({
        ...input,
        userId: user.id,
      })
      .returns({ success: true, revisionId: 123 })

    await mutation.shouldReturnData({
      page: { addRevision: { success: true, revisionId: 123 } },
    })
  })

  test('fails when user is not authenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('fails when user does not have role "staticPagesBuilder"', async () => {
    const regularUser = { ...user, id: nextUuid(user.id), roles: ['login'] }

    given('UuidQuery').for(regularUser)

    await new Client({ userId: regularUser.id })
      .prepareQuery({
        query: gql`
          mutation set($input: PageAddRevisionInput!) {
            page {
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

  test('fails when `title` or `content` is empty', async () => {
    await mutation
      .withVariables({
        input: {
          content: '',
          title: 'title',
          pageId: page.id,
        },
      })
      .shouldFailWithError('BAD_USER_INPUT')

    await mutation
      .withVariables({
        input: {
          content: 'content',
          title: '',
          pageId: page.id,
        },
      })
      .shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer returns a 400er response', async () => {
    given('PageAddRevisionMutation').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('PageAddRevisionMutation').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})
