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

import { article, user } from '../../__fixtures__'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
  createMessageHandler,
  createTestClient,
  createUuidHandler,
  getTypenameAndId,
} from '../__utils__'

describe('subscriptions', () => {
  beforeEach(() => {
    global.server.use(
      createUuidHandler(article),
      createUuidHandler(user),
      createSubscriptionsHandler({
        payload: { userId: user.id },
        body: {
          subscriptions: [{ objectId: article.id, sendEmail: true }],
        },
      })
    )
  })

  test('Article', async () => {
    const client = createTestClient({ userId: 1 })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query {
          subscription {
            getSubscriptions {
              nodes {
                object {
                  __typename
                  id
                }
                sendEmail
              }
            }
          }
        }
      `,
      data: {
        subscription: {
          getSubscriptions: {
            nodes: [
              {
                object: getTypenameAndId(article),
                sendEmail: true,
              },
            ],
          },
        },
      },
      client,
    })
  })

  test('currentUserHasSubscribed (true case)', async () => {
    const client = createTestClient({ userId: user.id })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query subscription($id: Int!) {
          subscription {
            currentUserHasSubscribed(id: $id)
          }
        }
      `,
      variables: { id: article.id },
      data: {
        subscription: {
          currentUserHasSubscribed: true,
        },
      },
      client,
    })
  })

  test('currentUserHasSubscribed (false case)', async () => {
    const client = createTestClient({ userId: user.id })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query subscription($id: Int!) {
          subscription {
            currentUserHasSubscribed(id: $id)
          }
        }
      `,
      variables: { id: article.id + 1 },
      data: {
        subscription: {
          currentUserHasSubscribed: false,
        },
      },
      client,
    })
  })
})

describe('subscription mutation set', () => {
  const mutation = gql`
    mutation set($input: SubscriptionSetInput!) {
      subscription {
        set(input: $input) {
          success
        }
      }
    }
  `
  const getSubscriptionsQuery = gql`
    query {
      subscription {
        getSubscriptions {
          nodes {
            object {
              id
            }
            sendEmail
          }
        }
      }
    }
  `
  const client = createTestClient({ userId: user.id })

  // given a single subscription to article.id
  beforeEach(async () => {
    // mock subscriptions handlers
    global.server.use(
      createUuidHandler(article),
      createUuidHandler(user),
      createUuidHandler({ ...article, id: 1555 }),
      createUuidHandler({ ...article, id: 1565 }),
      createSubscriptionsHandler({
        payload: { userId: user.id },
        body: {
          subscriptions: [{ objectId: article.id, sendEmail: false }],
        },
      })
    )

    // fill cache
    await assertSuccessfulGraphQLQuery({
      query: getSubscriptionsQuery,
      data: {
        subscription: {
          getSubscriptions: {
            nodes: [
              {
                object: { id: article.id },
                sendEmail: false,
              },
            ],
          },
        },
      },
      client,
    })
  })

  test('with array of ids', async () => {
    global.server.use(
      createSubscriptionSetMutationHandler({
        ids: [1565, 1555],
        userId: user.id,
        subscribe: true,
        sendEmail: false,
      })
    )

    await assertSuccessfulGraphQLMutation({
      mutation,
      variables: {
        input: { id: [1565, 1555], subscribe: true, sendEmail: false },
      },
      data: { subscription: { set: { success: true } } },
      client: createTestClient({ userId: user.id }),
    })

    //check cache
    await assertSuccessfulGraphQLQuery({
      query: getSubscriptionsQuery,
      data: {
        subscription: {
          getSubscriptions: {
            nodes: [
              {
                object: { id: 1555 },
                sendEmail: false,
              },
              {
                object: { id: 1565 },
                sendEmail: false,
              },
              {
                object: { id: article.id },
                sendEmail: false,
              },
            ],
          },
        },
      },
      client,
    })
  })

  test('unauthenticated', async () => {
    await assertFailingGraphQLMutation({
      mutation,
      variables: { input: { id: 1565, subscribe: true, sendEmail: false } },
      client: createTestClient({ userId: null }),
      expectedError: 'UNAUTHENTICATED',
    })
  })

  test('remove subscription, check cache mutation', async () => {
    global.server.use(
      createSubscriptionSetMutationHandler({
        ids: [article.id],
        userId: user.id,
        subscribe: false,
        sendEmail: false,
      })
    )

    await assertSuccessfulGraphQLMutation({
      mutation,
      variables: {
        input: { id: [article.id], subscribe: false, sendEmail: false },
      },
      data: { subscription: { set: { success: true } } },
      client,
    })

    //check cache
    await assertSuccessfulGraphQLQuery({
      query: getSubscriptionsQuery,
      data: {
        subscription: {
          getSubscriptions: {
            nodes: [],
          },
        },
      },
      client,
    })
  })
})

function createSubscriptionsHandler({
  payload,
  body,
}: {
  payload: { userId: number }
  body: Record<string, unknown>
}) {
  return createMessageHandler({
    message: {
      type: 'SubscriptionsQuery',
      payload,
    },
    body,
  })
}

function createSubscriptionSetMutationHandler(
  payload: Record<string, unknown>
) {
  return createMessageHandler({
    message: {
      type: 'SubscriptionSetMutation',
      payload,
    },
  })
}
