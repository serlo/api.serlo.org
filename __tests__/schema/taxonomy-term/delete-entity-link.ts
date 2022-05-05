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
  article,
  user as baseUser,
  taxonomyTermCurriculumTopic,
} from '../../../__fixtures__'
import { Client, given } from '../../__utils__'

const user = { ...baseUser, roles: ['de_architect'] }

const input = {
  entityIds: [article.id],
  taxonomyTermId: taxonomyTermCurriculumTopic.id,
}

const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation ($input: TaxonomyEntityLinkInput!) {
        taxonomyTerm {
          deleteEntityLink(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput(input)

beforeEach(() => {
  given('UuidQuery').for(
    { ...article, taxonomyTermIds: [taxonomyTermCurriculumTopic.id] },
    taxonomyTermCurriculumTopic,
    user
  )

  given('TaxonomyDeleteEntityLinkMutation')
    .withPayload({ ...input, userId: user.id })
    .isDefinedBy((_req, res, ctx) => {
      given('UuidQuery').for({
        ...article,
        taxonomyTermIds: [],
      })
      given('UuidQuery').for({
        ...taxonomyTermCurriculumTopic,
        childrenIds: [],
      })
      return res(ctx.json({ success: true }))
    })
})

test('returns { success, record } when mutation could be successfully executed', async () => {
  await mutation.shouldReturnData({
    taxonomyTerm: {
      deleteEntityLink: {
        success: true,
      },
    },
  })
})

test('updates the cache', async () => {
  const childQuery = new Client({ userId: user.id }).prepareQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          ... on Article {
            taxonomyTerms {
              nodes {
                id
              }
            }
          }
        }
      }
    `,
    variables: { id: article.id },
  })
  await childQuery.shouldReturnData({
    uuid: {
      taxonomyTerms: {
        nodes: [
          {
            id: taxonomyTermCurriculumTopic.id,
          },
        ],
      },
    },
  })

  const parentQuery = new Client({ userId: user.id }).prepareQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          ... on TaxonomyTerm {
            children {
              nodes {
                id
              }
            }
          }
        }
      }
    `,
    variables: { id: taxonomyTermCurriculumTopic.id },
  })

  await parentQuery.shouldReturnData({
    uuid: {
      children: {
        nodes: [
          {
            id: article.id,
          },
        ],
      },
    },
  })

  await mutation.execute()

  await parentQuery.shouldReturnData({
    uuid: {
      children: {
        nodes: [],
      },
    },
  })
  await childQuery.shouldReturnData({
    uuid: {
      taxonomyTerms: {
        nodes: [],
      },
    },
  })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "architect"', async () => {
  await mutation.forLoginUser().shouldFailWithError('FORBIDDEN')
})

test('fails when database layer returns a 400er response', async () => {
  given('TaxonomyDeleteEntityLinkMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('TaxonomyDeleteEntityLinkMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
