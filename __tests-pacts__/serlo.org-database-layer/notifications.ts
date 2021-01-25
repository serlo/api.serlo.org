/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'

import { checkoutRevisionNotificationEvent, user } from '../../__fixtures__'
import { createTestClient } from '../../__tests__/__utils__'
import { addJsonInteraction, assertSuccessfulGraphQLQuery } from '../__utils__'

test('Notifications', async () => {
  global.client = createTestClient({ userId: user.id })
  await addJsonInteraction({
    name: `fetch data of all notifications for user with id ${user.id}`,
    given: `there exists a notification for user with id ${user.id}`,
    path: `/notifications/${user.id}`,
    body: {
      userId: user.id,
      notifications: Matchers.eachLike({
        id: Matchers.integer(1),
        unread: Matchers.boolean(true),
        eventId: Matchers.integer(checkoutRevisionNotificationEvent.id),
      }),
    },
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
      notifications: {
        nodes: [
          {
            id: 1,
            unread: true,
          },
        ],
        totalCount: 1,
      },
    },
  })
})
