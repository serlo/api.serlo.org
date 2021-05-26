/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'

import { articleRevision, user } from '../../../__fixtures__'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  createDatabaseLayerHandler,
  createMessageHandler,
  createTestClient,
  createUuidHandler,
} from '../../__utils__'

test('when revision can be successfully checkout', async () => {
  const client = createTestClient({ userId: user.id })
  global.server.use(createCheckoutRevisionHandler({ success: true }))
  global.server.use(createUuidHandler(articleRevision))

  await assertSuccessfulGraphQLMutation({
    ...createCheckoutRevisionMutation(),
    data: { entity: { checkoutRevision: { success: true } } },
    client,
  })
})

test('fails when user is not authenticated', async () => {
  const client = createTestClient({ userId: null })

  await assertFailingGraphQLMutation({
    ...createCheckoutRevisionMutation(),
    client,
    expectedError: 'UNAUTHENTICATED',
  })
})

test('fails when database layer has an internal error', async () => {
  global.server.use(
    createDatabaseLayerHandler({
      matchType: 'EntityCheckoutRevisionMutation',
      resolver(_req, res, ctx) {
        return res(ctx.status(500))
      },
    })
  )
  const client = createTestClient({ userId: user.id })

  await assertFailingGraphQLMutation({
    ...createCheckoutRevisionMutation(),
    client,
    expectedError: 'INTERNAL_SERVER_ERROR',
  })
})

function createCheckoutRevisionHandler(body: { success: boolean }) {
  return createMessageHandler({
    message: {
      type: 'EntityCheckoutRevisionMutation',
      payload: {
        revisionId: articleRevision.id,
        userId: user.id,
        reason: 'given reason',
      },
    },
    body,
  })
}

function createCheckoutRevisionMutation() {
  return {
    mutation: gql`
      mutation ($input: CheckoutRevisionInput!) {
        entity {
          checkoutRevision(input: $input) {
            success
          }
        }
      }
    `,
    variables: {
      input: { revisionId: articleRevision.id, reason: 'given reason' },
    },
  }
}
