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
import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'

import { article, user } from '../../__fixtures__'
import { createTestClient, createUuidHandler } from '../../__tests__/__utils__'
import {
  addMessageInteraction,
  assertSuccessfulGraphQLMutation,
} from '../__utils__'

test('SubscriptionsQuery', async () => {
  const message = {
    type: 'SubscriptionsQuery',
    payload: {
      userId: user.id,
    },
  }
  await addMessageInteraction({
    given: `there exists a subscription for user with id ${user.id}`,
    message,
    responseBody: {
      subscriptions: Matchers.eachLike({
        objectId: Matchers.integer(1),
        sendEmail: Matchers.boolean(false),
      }),
    },
  })
  const response = await global.serloModel.getSubscriptions({ userId: user.id })
  expect(response).toEqual({
    subscriptions: [
      {
        objectId: 1,
        sendEmail: false,
      },
    ],
  })
})

test('SubscriptionSetMutation', async () => {
  global.client = createTestClient({ userId: user.id })
  global.server.use(createUuidHandler(user), createUuidHandler(article))

  await addMessageInteraction({
    given: `there exists uuid ${article.id} and user ${user.id} with no prior subscription`,
    message: {
      type: 'SubscriptionSetMutation',
      payload: {
        ids: [article.id],
        userId: user.id,
        subscribe: true,
        sendEmail: false,
      },
    },
  })

  await assertSuccessfulGraphQLMutation({
    mutation: gql`
      mutation setSubscription($input: SubscriptionSetInput!) {
        subscription {
          set(input: $input) {
            success
          }
        }
      }
    `,
    variables: { input: { id: article.id, subscribe: true, sendEmail: false } },
    data: { subscription: { set: { success: true } } },
  })
})
