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
import { Instance } from '@serlo/api'
import { gql } from 'apollo-server'

import {
  article as baseArticle,
  articleRevision,
  user as baseUser,
} from '../../../__fixtures__'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
  createDatabaseLayerHandler,
  createTestClient,
  givenUuidQueryEndpoint,
  givenSerloEndpoint,
} from '../../__utils__'
import { Model } from '~/internals/graphql'

// TODO: Move this + other helper functions like givenUuid to setup.ts
// when it passes review
let uuids: Record<number, Model<'AbstractUuid'> | undefined>

const user = { ...baseUser, roles: ['de_reviewer'] }
const article = {
  ...baseArticle,
  instance: Instance.De,
  currentRevision: articleRevision.id,
}
const unrevisedRevision = { ...articleRevision, id: articleRevision.id + 1 }

beforeEach(() => {
  uuids = {}

  givenUuids([user, article, articleRevision, unrevisedRevision])

  givenUuidQueryEndpoint((req, res, ctx) => {
    const uuid = uuids[req.body.payload.id]

    return uuid ? res(ctx.json(uuid)) : res(ctx.json(null), ctx.status(404))
  })
  givenSerloEndpoint<{
    revisionId: number
    reason: string
    userId: number
  }>('EntityCheckoutRevisionMutation', (req, res, ctx) => {
    const { revisionId, reason, userId } = req.body.payload

    // In order to test whether these parameters are passed properly
    // TODO: What are the expected site effects, where do we see these
    // things?
    if (userId !== user.id || reason !== 'given reason') {
      return res(ctx.status(500))
    }

    const revision = uuids[revisionId]

    if (revision === undefined || revision.__typename != 'ArticleRevision') {
      // TODO
      return res(
        ctx.status(400),
        ctx.json({ success: false, reason: 'revision does not exist' })
      )
    }

    const article = uuids[revision.repositoryId]

    if (article === undefined || article.__typename != 'Article') {
      // TODO
      return res(ctx.status(501))
    }

    if (
      article.currentRevisionId !== null &&
      article.currentRevisionId >= revisionId
    ) {
      // TODO
      return res(ctx.status(502))
    }

    article.currentRevisionId = revisionId

    return res(ctx.json({ success: true }))
  })
})

test('when revision can be successfully checkout', async () => {
  const client = createTestClient({ userId: user.id })

  await assertSuccessfulGraphQLMutation({
    ...createCheckoutRevisionMutation(),
    data: { entity: { checkoutRevision: { success: true } } },
    client,
  })
})

test('api cache is updated properly', async () => {
  const client = createTestClient({ userId: user.id })

  await assertSuccessfulGraphQLQuery({
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
    data: { uuid: { currentRevision: { id: articleRevision.id } } },
    client,
  })

  await assertSuccessfulGraphQLMutation({
    ...createCheckoutRevisionMutation(),
    data: { entity: { checkoutRevision: { success: true } } },
    client,
  })

  await assertSuccessfulGraphQLQuery({
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
    data: { uuid: { currentRevision: { id: unrevisedRevision.id } } },
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

test('fails when user does not have role "reviewer"', async () => {
  const client = createTestClient({ userId: user.id })
  givenUuid({ ...user, roles: ['login', 'de_moderator'] })

  await assertFailingGraphQLMutation({
    ...createCheckoutRevisionMutation(),
    client,
    expectedError: 'FORBIDDEN',
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
      input: { revisionId: unrevisedRevision.id, reason: 'given reason' },
    },
  }
}

function givenUuids(uuids: Model<'AbstractUuid'>[]) {
  for (const uuid of uuids) {
    givenUuid(uuid)
  }
}

function givenUuid(uuid: Model<'AbstractUuid'>) {
  // A copy of the uuid is created here so that changes of the uuid object in
  // the `uuids` database does not affect the passed object
  uuids[uuid.id] = { ...uuid }
}
