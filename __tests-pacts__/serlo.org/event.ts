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
  createCommentNotificationEvent,
  createThreadNotificationEvent,
  getCreateCommentNotificationEventDataWithoutSubResolvers,
  getCreateThreadNotificationEventDataWithoutSubResolvers,
} from '../../__fixtures__'
import { AbstractNotificationEventPayload } from '../../src/graphql/schema/notification'
import { addJsonInteraction, assertSuccessfulGraphQLQuery } from '../__utils__'

async function addNotificationEventInteraction<
  T extends Pick<AbstractNotificationEventPayload, '__typename' | 'id'>
>(body: T) {
  await addJsonInteraction({
    name: `fetch data of event with id ${body.id}`,
    given: `event ${body.id} is of type ${body.__typename}`,
    path: `/api/event/${body.id}`,
    body,
  })
}

test('CreateCommentNotificationEvent', async () => {
  await addNotificationEventInteraction({
    __typename: createCommentNotificationEvent.__typename,
    id: createCommentNotificationEvent.id,
    instance: Matchers.string(createCommentNotificationEvent.instance),
    date: Matchers.iso8601DateTime(createCommentNotificationEvent.date),
    authorId: Matchers.integer(createCommentNotificationEvent.authorId),
    threadId: Matchers.integer(createCommentNotificationEvent.threadId),
    commentId: Matchers.integer(createCommentNotificationEvent.commentId),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query notificationEvent($id: Int!) {
        notificationEvent(id: $id) {
          __typename
          ... on CreateCommentNotificationEvent {
            id
            instance
            date
          }
        }
      }
    `,
    variables: createCommentNotificationEvent,
    data: {
      notificationEvent: getCreateCommentNotificationEventDataWithoutSubResolvers(
        createCommentNotificationEvent
      ),
    },
  })
})

test('CreateThreadNotificationEvent', async () => {
  await addNotificationEventInteraction({
    __typename: createThreadNotificationEvent.__typename,
    id: createThreadNotificationEvent.id,
    instance: Matchers.string(createThreadNotificationEvent.instance),
    date: Matchers.iso8601DateTime(createThreadNotificationEvent.date),
    authorId: Matchers.integer(createThreadNotificationEvent.authorId),
    objectId: Matchers.integer(createThreadNotificationEvent.objectId),
    threadId: Matchers.integer(createThreadNotificationEvent.threadId),
  })
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
