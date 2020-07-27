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
import { gql } from 'apollo-server'
import * as R from 'ramda'

import {
  article,
  notificationEvent,
  notifications,
  user,
} from '../../__fixtures__'
import { createTestClient } from '../../__tests__/__utils__'
import { Service } from '../../src/graphql/schema/types'
import {
  addArticleInteraction,
  addNotificationEventInteraction,
  addNotificationsInteraction,
  addUserInteraction,
  assertSuccessfulGraphQLQuery,
} from '../__utils__'

test('Notifications', async () => {
  global.client = createTestClient({
    service: Service.Serlo,
    user: 2,
  }).client

  await addNotificationsInteraction(notifications)
  await addNotificationEventInteraction(notificationEvent)
  await addUserInteraction(user)
  await addArticleInteraction(article)

  await assertSuccessfulGraphQLQuery({
    query: gql`
      {
        notifications {
          totalCount
          nodes {
            id
            unread
            event {
              id
              type
              instance
              date
              actor {
                id
                username
              }
              object {
                ... on Article {
                  id
                  trashed
                }
              }
              payload
            }
          }
        }
      }
    `,
    data: {
      notifications: {
        totalCount: 1,
        nodes: [
          {
            id: 1,
            unread: true,
            event: {
              ...R.omit(['actorId', 'objectId'], notificationEvent),
              actor: {
                id: 1,
                username: 'username',
              },
              object: {
                id: 1855,
                trashed: false,
              },
              payload: 'string',
            },
          },
        ],
      },
    },
  })
})
