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

import {
  taxonomyTermCurriculumTopic,
  taxonomyTermSubject,
  taxonomyTermRoot,
  user as baseUser,
} from '../../../__fixtures__'
import { Client, given, nextUuid } from '../../__utils__'

describe('TaxonomyTermMoveMutation', () => {
  const user = { ...baseUser, roles: ['login'] }

  const taxonomyTermSubject2 = {
    ...taxonomyTermSubject,
    id: nextUuid(taxonomyTermSubject.id),
  }
  const input = {
    childrenIds: [taxonomyTermSubject.id, taxonomyTermSubject2.id],
    destination: taxonomyTermCurriculumTopic.id,
  }

  const mutation = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation set($input: TaxonomyTermMoveInput!) {
          taxonomyTerm {
            move(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withVariables({ input })

  beforeEach(() => {
    given('UuidQuery').for(
      user,
      taxonomyTermSubject,
      taxonomyTermSubject2,
      taxonomyTermCurriculumTopic
    )
  })

  test('returns "{ success: true }" when mutation could be successfully executed', async () => {
    given('TaxonomyTermMoveMutation')
      .withPayload({ ...input, userId: user.id })
      .returns({ success: true })

    await mutation.shouldReturnData({
      taxonomyTerm: { move: { success: true } },
    })
  })

  test('fails when user is not authenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('fails when user does not have permission "TaxonomyTerm_AddChild"', async () => {
    const loginUser = { ...user, id: nextUuid(user.id), roles: ['architect'] }

    given('UuidQuery').for(loginUser)

    await mutation
      .forClient(new Client({ userId: loginUser.id }))
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when database layer returns a 400er response', async () => {
    given('TaxonomyTermMoveMutation').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('TaxonomyTermMoveMutation').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })

  test('updates the cache', async () => {
    given('UuidQuery').for(user, taxonomyTermSubject, taxonomyTermRoot)

    const query = new Client({ userId: user.id })
      .prepareQuery({
        query: gql`
          query ($id: Int!) {
            uuid(id: $id) {
              ... on TaxonomyTerm {
                parent {
                  id
                }
              }
            }
          }
        `,
      })
      .withVariables({ id: taxonomyTermSubject.id })

    await query.shouldReturnData({
      uuid: {
        parent: { id: taxonomyTermSubject.parentId },
      },
    })

    given('UuidQuery').for(
      { ...user, roles: ['login'] },
      taxonomyTermSubject,
      taxonomyTermSubject2,
      taxonomyTermCurriculumTopic
    )

    await query.execute()

    const query2 = new Client({ userId: user.id })
      .prepareQuery({
        query: gql`
          mutation set($input: TaxonomyTermMoveInput!) {
            taxonomyTerm {
              move(input: $input) {
                success
              }
            }
          }
        `,
      })
      .withVariables({ input })

    given('TaxonomyTermMoveMutation')
      .withPayload({ ...input, userId: user.id })
      .returns({ success: true })

    await query2.shouldReturnData({ taxonomyTerm: { move: { success: true } } })

    global.server.resetHandlers()
    given('UuidQuery').for(
      user,
      { ...taxonomyTermSubject, parentId: taxonomyTermCurriculumTopic.id },
      taxonomyTermSubject2,
      taxonomyTermCurriculumTopic
    )

    await query.shouldReturnData({
      uuid: {
        parent: { id: taxonomyTermCurriculumTopic.id },
      },
    })

  })
})
