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
import { Instance } from '@serlo/api'
import { gql } from 'apollo-server'

import {
  article as baseArticle,
  articleRevision,
  user as baseUser,
  taxonomyTermSubject,
} from '../../../__fixtures__'
import { getTypenameAndId, nextUuid, given, Client } from '../../__utils__'
import { encodeId } from '~/internals/graphql'

const user = { ...baseUser, roles: ['de_reviewer'] }
const article = {
  ...baseArticle,
  instance: Instance.De,
  currentRevision: articleRevision.id,
}
const unrevisedRevision = {
  ...articleRevision,
  id: nextUuid(articleRevision.id),
  trashed: true,
}
const mutation = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    mutation ($input: CheckoutRevisionInput!) {
      entity {
        checkoutRevision(input: $input) {
          success
        }
      }
    }
  `,
  variables: { input: { revisionId: unrevisedRevision.id, reason: 'reason' } },
})

beforeEach(() => {
  given('UuidQuery').for(user, article, articleRevision, unrevisedRevision)
  given('UnrevisedEntitiesQuery').for([article])

  given('EntityCheckoutRevisionMutation')
    .withPayload({
      userId: user.id,
      reason: 'reason',
      revisionId: unrevisedRevision.id,
    })
    .isDefinedBy((_req, res, ctx) => {
      given('UuidQuery').for({ ...unrevisedRevision, trashed: false })
      given('UuidQuery').for({
        ...article,
        currentRevisionId: unrevisedRevision.id,
      })
      given('UnrevisedEntitiesQuery').for([])

      return res(ctx.json({ success: true }))
    })
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  await mutation.shouldReturnData({
    entity: { checkoutRevision: { success: true } },
  })
})

test('following queries for entity point to checkout revision when entity is already in the cache', async () => {
  const articleQuery = new Client().prepareQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          ... on Article {
            currentRevision {
              id
            }
          }
        }
      }
    `,
    variables: { id: article.id },
  })

  await articleQuery.shouldReturnData({
    uuid: { currentRevision: { id: articleRevision.id } },
  })

  await mutation.shouldReturnData({
    entity: { checkoutRevision: { success: true } },
  })

  await articleQuery.shouldReturnData({
    uuid: { currentRevision: { id: unrevisedRevision.id } },
  })
})

test('checkout revision has trashed == false for following queries', async () => {
  const revisionQuery = new Client().prepareQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          ... on ArticleRevision {
            trashed
          }
        }
      }
    `,
    variables: { id: unrevisedRevision.id },
  })

  await revisionQuery.shouldReturnData({ uuid: { trashed: true } })

  await mutation.shouldReturnData({
    entity: { checkoutRevision: { success: true } },
  })

  await revisionQuery.shouldReturnData({ uuid: { trashed: false } })
})

test('after the checkout mutation the cache is cleared for unrevisedEntities', async () => {
  given('SubjectsQuery').for(taxonomyTermSubject)
  given('UuidQuery').for(article)

  const unrevisedEntitiesQuery = new Client().prepareQuery({
    query: gql`
      query ($id: String!) {
        subject {
          subject(id: $id) {
            unrevisedEntities {
              nodes {
                __typename
                id
              }
            }
          }
        }
      }
    `,
    variables: { id: encodeId({ prefix: 's', id: taxonomyTermSubject.id }) },
  })

  await unrevisedEntitiesQuery.shouldReturnData({
    subject: {
      subject: { unrevisedEntities: { nodes: [getTypenameAndId(article)] } },
    },
  })

  await mutation.shouldReturnData({
    entity: { checkoutRevision: { success: true } },
  })

  await unrevisedEntitiesQuery.shouldReturnData({
    subject: { subject: { unrevisedEntities: { nodes: [] } } },
  })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "reviewer"', async () => {
  await mutation.forLoginUser('de_moderator').shouldFailWithError('FORBIDDEN')
})

test('fails when database layer returns a 400er response', async () => {
  given('EntityCheckoutRevisionMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('EntityCheckoutRevisionMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
