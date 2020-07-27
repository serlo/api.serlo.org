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

import {
  NotificationEventPayload,
  NotificationPayload,
  NotificationsPayload,
} from '../src/graphql/schema'
import { Instance, MutationSetNotificationStateArgs } from '../src/types'

export const notificationEvent: NotificationEventPayload = {
  id: 1,
  type: 'string',
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: 1,
  objectId: 1855,
  payload: 'string',
}

export const notification: NotificationPayload = {
  id: 1,
  unread: true,
  eventId: notificationEvent.id,
}

export const notifications: NotificationsPayload = {
  notifications: [notification],
  userId: 2,
}

export function createSetNotificationStateMutation(
  variables: MutationSetNotificationStateArgs
) {
  return {
    mutation: gql`
      mutation setNotificationState($id: Int!, $unread: Boolean!) {
        setNotificationState(id: $id, unread: $unread)
      }
    `,
    variables,
  }
}
