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
  user as baseUser,
} from '../../../__fixtures__'
import { Client, given } from '../../__utils__'

describe('TaxonomyTermSetNameAndDescriptionMutation', () => {
  const user = { ...baseUser, roles: ['de_architect'] }

  const input = {
    description: 'a description',
    name: 'a name',
    id: taxonomyTermCurriculumTopic.id,
  }

  const mutation = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation set($input: TaxonomyTermSetNameAndDescriptionInput!) {
          taxonomyTerm {
            setNameAndDescription(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withVariables({ input })

  beforeEach(() => {
    given('UuidQuery').for(user, taxonomyTermCurriculumTopic)
  })

  test('returns "{ success: true }" when mutation could be successfully executed', async () => {
    given('TaxonomyTermSetNameAndDescriptionMutation')
      .withPayload({ ...input, userId: user.id })
      .returns({ success: true })

    await mutation.shouldReturnData({
      taxonomyTerm: { setNameAndDescription: { success: true } },
    })
  })

  test('fails when user is not authenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('fails when user does not have role "architect"', async () => {
    await mutation.forLoginUser().shouldFailWithError('FORBIDDEN')
  })

  test('fails when `name` is empty', async () => {
    await mutation
      .withVariables({ input: { ...input, name: '' } })
      .shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer returns a 400er response', async () => {
    given('TaxonomyTermSetNameAndDescriptionMutation').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('TaxonomyTermSetNameAndDescriptionMutation').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })

  test('updates the cache', async () => {
    const query = new Client({ userId: user.id }).prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on TaxonomyTerm {
              name
              description
            }
          }
        }
      `,
      variables: { id: taxonomyTermCurriculumTopic.id },
    })

    await query.shouldReturnData({
      uuid: {
        name: taxonomyTermCurriculumTopic.name,
        description: taxonomyTermCurriculumTopic.description,
      },
    })

    given('TaxonomyTermSetNameAndDescriptionMutation')
      .withPayload({
        ...input,
        userId: user.id,
      })
      .isDefinedBy((req, res, ctx) => {
        const { name, description } = req.body.payload

        given('UuidQuery').for({
          ...taxonomyTermCurriculumTopic,
          name,
          description,
        })

        return res(ctx.json({ success: true }))
      })
    await mutation.shouldReturnData({
      taxonomyTerm: { setNameAndDescription: { success: true } },
    })

    await query.shouldReturnData({
      uuid: { name: 'a name', description: 'a description' },
    })
  })
})
