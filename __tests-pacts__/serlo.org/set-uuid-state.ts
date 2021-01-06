/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'

import { checkoutRevisionNotificationEvent, user } from '../../__fixtures__'
import { createTestClient } from '../../__tests__/__utils__'
import {
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
} from '../__utils__'
import { Service } from '~/internals/auth'

test('set-uuid-state', async () => {
  global.client = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: user.id,
  })
  await global.pact.addInteraction({
    uponReceiving: `set state of notification with id 9`,
    state: `there exists a notification with id 9 for user with id ${user.id}`,
    withRequest: {
      method: 'POST',
      path: '/api/set-notification-state/9',
      body: {
        userId: user.id,
        unread: Matchers.boolean(true),
      },
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: {
        userId: user.id,
        notifications: Matchers.eachLike({
          id: Matchers.integer(9),
          unread: Matchers.boolean(true),
          eventId: Matchers.integer(checkoutRevisionNotificationEvent.id),
        }),
      },
    },
  })
  await assertSuccessfulGraphQLMutation({
    mutation: gql`
      mutation notification($input: NotificationSetStateInput!) {
        notification {
          setState(input: $input) {
            success
          }
        }
      }
    `,
    variables: { input: { id: 9, unread: true } },
    data: { notification: { setState: { success: true } } },
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query {
        notifications {
          nodes {
            id
            unread
          }
          totalCount
        }
      }
    `,
    data: {
      notifications: { nodes: [{ id: 9, unread: true }], totalCount: 1 },
    },
  })
})
