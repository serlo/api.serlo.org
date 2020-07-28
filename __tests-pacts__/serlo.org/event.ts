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

import {
  createThreadNotificationEvent,
  getCreateThreadNotificationEventDataWithoutSubResolvers,
} from '../../__fixtures__'
import { CreateThreadNotificationEventPayload } from '../../src/graphql/schema/notification'
import { addJsonInteraction, assertSuccessfulGraphQLQuery } from '../__utils__'

function addCreateThreadNotificationEventInteraction(
  payload: CreateThreadNotificationEventPayload
) {
  return addJsonInteraction({
    name: `fetch data of event with id ${payload.id}`,
    given: `event ${payload.id} is of type ${payload.__typename}`,
    path: `/api/event/${payload.id}`,
    body: {
      __typename: payload.__typename,
      id: payload.id,
      instance: Matchers.string(payload.instance),
      date: Matchers.iso8601DateTime(payload.date),
      authorId: Matchers.integer(payload.authorId),
      objectId: Matchers.integer(payload.objectId),
      threadId: Matchers.integer(payload.threadId),
    },
  })
}

test('CreateThreadNotificationEvent', async () => {
  await addCreateThreadNotificationEventInteraction(
    createThreadNotificationEvent
  )
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query notificationEvent($id: Int!) {
        notificationEvent(id: $id) {
          __typename
          ... on CreateThreadNotificationEvent {
            id
            instance
            date
          }
        }
      }
    `,
    variables: createThreadNotificationEvent,
    data: {
      notificationEvent: getCreateThreadNotificationEventDataWithoutSubResolvers(
        createThreadNotificationEvent
      ),
    },
  })
})
