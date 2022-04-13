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
  taxonomyTermSubject,
  user as baseUser,
} from '../../../__fixtures__'
import { given, getTypenameAndId, nextUuid, Client } from '../../__utils__'
import { encodeId } from '~/internals/graphql'

const user = { ...baseUser, roles: ['de_reviewer'] }
const article = {
  ...baseArticle,
  instance: Instance.De,
  currentRevision: articleRevision.id,
}
const currentRevision = {
  ...articleRevision,
  id: nextUuid(articleRevision.id),
  trashed: false,
}
const mutation = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    mutation ($input: RejectRevisionInput!) {
      entity {
        rejectRevision(input: $input) {
          success
        }
      }
    }
  `,
  variables: { input: { revisionId: currentRevision.id, reason: 'reason' } },
})

beforeEach(() => {
  given('UuidQuery').for(user, article, articleRevision, currentRevision)
  given('SubjectsQuery').for(taxonomyTermSubject)
  given('UnrevisedEntitiesQuery').for([article])

  given('EntityRejectRevisionMutation')
    .withPayload({
      userId: user.id,
      reason: 'reason',
      revisionId: currentRevision.id,
    })
    .isDefinedBy((_req, res, ctx) => {
      given('UuidQuery').for({ ...currentRevision, trashed: true })
      given('UnrevisedEntitiesQuery').for([])

      return res(ctx.json({ success: true }))
    })
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  await mutation.shouldReturnData({
    entity: { rejectRevision: { success: true } },
  })
})

test('following queries for entity point to checkout revision when entity is already in the cache', async () => {
  const revisionQuery = new Client().prepareQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          trashed
        }
      }
    `,
    variables: { id: currentRevision.id },
  })

  await revisionQuery.shouldReturnData({ uuid: { trashed: false } })

  await mutation.shouldReturnData({
    entity: { rejectRevision: { success: true } },
  })

  await revisionQuery.shouldReturnData({ uuid: { trashed: true } })
})

test('after the reject mutation the cache is cleared for unrevisedEntities', async () => {
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
    entity: { rejectRevision: { success: true } },
  })

  await unrevisedEntitiesQuery.shouldReturnData({
    subject: { subject: { unrevisedEntities: { nodes: [] } } },
  })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "reviewer"', async () => {
  given('UuidQuery').for({ ...user, roles: ['login', 'de_moderator'] })

  await mutation.shouldFailWithError('FORBIDDEN')
})

test('fails when database layer returns a 400er response', async () => {
  given('EntityRejectRevisionMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('EntityRejectRevisionMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
