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
  taxonomyTermRoot,
  taxonomyTermSubject,
  taxonomyTermTopic,
  user as baseUser,
} from '../../../__fixtures__'
import { Client, given, nextUuid } from '../../__utils__'
import { TaxonomyTermType, TaxonomyTypeCreateOptions } from '~/types'

describe('TaxonomyTermCreateMutation', () => {
  const user = { ...baseUser, roles: ['de_architect'] }

  const input = {
    parentId: taxonomyTermSubject.id,
    name: 'a name ',
    description: 'a description',
    taxonomyType: TaxonomyTypeCreateOptions.Topic,
  }

  const mutation = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation set($input: TaxonomyTermCreateInput!) {
          taxonomyTerm {
            create(input: $input) {
              success
              record {
                id
              }
            }
          }
        }
      `,
    })
    .withVariables({ input })

  beforeEach(() => {
    given('UuidQuery').for(user, taxonomyTermSubject)

    given('TaxonomyTermCreateMutation')
      .withPayload({
        ...input,
        taxonomyType: TaxonomyTermType.Topic,
        userId: user.id,
      })
      .returns(taxonomyTermTopic)
  })

  test('returns { success, record } when mutation could be successfully executed', async () => {
    await mutation.shouldReturnData({
      taxonomyTerm: {
        create: {
          success: true,
          record: { id: taxonomyTermTopic.id },
        },
      },
    })
  })

  test('fails when parent does not accept topic or topicFolder', async () => {
    given('UuidQuery').for(taxonomyTermRoot)

    await mutation
      .withVariables({ ...input, parentId: taxonomyTermRoot.id })
      .shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when user is not authenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('fails when user does not have role "architect"', async () => {
    const loginUser = { ...user, id: nextUuid(user.id), roles: ['login'] }

    given('UuidQuery').for(loginUser)

    await mutation
      .forClient(new Client({ userId: loginUser.id }))
      .withVariables({ input })
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when database layer returns a 400er response', async () => {
    given('TaxonomyTermCreateMutation').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('TaxonomyTermCreateMutation').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})
