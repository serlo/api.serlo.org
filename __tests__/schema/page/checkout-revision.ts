/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Instance } from '@serlo/api'
import { gql } from 'apollo-server'

import {
  page as basePage,
  pageRevision,
  user as baseUser,
} from '../../../__fixtures__'
import { given, nextUuid, Client } from '../../__utils__'

const user = { ...baseUser, roles: ['de_static_pages_builder'] }
const page = {
  ...basePage,
  instance: Instance.De,
  currentRevision: pageRevision.id,
}
const unrevisedRevision = {
  ...pageRevision,
  id: nextUuid(pageRevision.id),
  trashed: true,
}
const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation ($input: CheckoutRevisionInput!) {
        page {
          checkoutRevision(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput({ revisionId: unrevisedRevision.id, reason: 'reason' })

beforeEach(() => {
  given('UuidQuery').for(user, page, pageRevision, unrevisedRevision)
  given('PageCheckoutRevisionMutation')
    .withPayload({
      userId: user.id,
      reason: 'reason',
      revisionId: unrevisedRevision.id,
    })
    .isDefinedBy((_req, res, ctx) => {
      given('UuidQuery').for({
        ...page,
        currentRevisionId: unrevisedRevision.id,
      })
      given('UuidQuery').for({ ...unrevisedRevision, trashed: false })

      return res(ctx.json({ success: true }))
    })
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  await mutation.shouldReturnData({
    page: { checkoutRevision: { success: true } },
  })
})

test('following queries for page point to checkout revision when page is already in the cache', async () => {
  const pageQuery = new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on Page {
              currentRevision {
                id
              }
            }
          }
        }
      `,
    })
    .withVariables({ id: page.id })

  await pageQuery.shouldReturnData({
    uuid: { currentRevision: { id: pageRevision.id } },
  })

  await mutation.shouldReturnData({
    page: { checkoutRevision: { success: true } },
  })

  await pageQuery.shouldReturnData({
    uuid: { currentRevision: { id: unrevisedRevision.id } },
  })
})

test('checkout revision has trashed == false for following queries', async () => {
  const revisionQuery = new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on PageRevision {
              trashed
            }
          }
        }
      `,
    })
    .withVariables({ id: unrevisedRevision.id })

  await revisionQuery.shouldReturnData({ uuid: { trashed: true } })

  await mutation.shouldReturnData({
    page: { checkoutRevision: { success: true } },
  })

  await revisionQuery.shouldReturnData({ uuid: { trashed: false } })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "static_pages_builder"', async () => {
  await mutation.forLoginUser('de_moderator').shouldFailWithError('FORBIDDEN')
})

test('fails when database layer returns a 400er response', async () => {
  given('PageCheckoutRevisionMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('PageCheckoutRevisionMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
