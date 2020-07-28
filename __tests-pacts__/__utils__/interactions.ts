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

import {
  AliasPayload,
  NavigationPayload,
  LegacyNotificationEventPayload,
  LegacyNotificationsPayload,
  UuidPayload,
} from '../../src/graphql/schema'

export function addNavigationInteraction(payload: NavigationPayload) {
  return addJsonInteraction({
    name: `fetch data of navigation`,
    given: '',
    path: '/api/navigation',
    body: {
      data: Matchers.eachLike({
        label: Matchers.string(payload.data[0].label),
        id: Matchers.integer(payload.data[0].id),
        children: Matchers.eachLike({
          label: Matchers.string(payload.data[0].children?.[0].label),
          id: Matchers.integer(payload.data[0].children?.[0].id),
        }),
      }),
    },
  })
}

export function addNotificationEventInteraction(
  payload: LegacyNotificationEventPayload
) {
  return addJsonInteraction({
    name: `fetch data of event with id ${payload.id}`,
    given: `there exists a notification event with id ${payload.id}`,
    path: `/api/event/${payload.id}`,
    body: {
      id: 1,
      type: Matchers.string(payload.type),
      instance: Matchers.string(payload.instance),
      date: Matchers.string(payload.date),
      actorId: Matchers.integer(payload.actorId),
      objectId: Matchers.integer(payload.objectId),
      payload: Matchers.string(payload.payload),
    },
  })
}

export function addNotificationsInteraction(
  payload: LegacyNotificationsPayload
) {
  return addJsonInteraction({
    name: `fetch data of all notifications for user with id ${payload.userId}`,
    given: `there exists a notification for user with id ${payload.userId}`,
    path: `/api/notifications/${payload.userId}`,
    body: {
      userId: 2,
      notifications:
        payload.notifications.length > 0
          ? Matchers.eachLike(Matchers.like(payload.notifications[0]))
          : [],
    },
  })
}

export function addAliasInteraction(payload: AliasPayload) {
  return addJsonInteraction({
    name: `fetch data of alias ${payload.path}`,
    given: `${payload.path} is alias of ${payload.source}`,
    path: `/api/alias${payload.path}`,
    body: {
      id: payload.id,
      instance: Matchers.string(payload.instance),
      path: payload.path,
      source: payload.source,
      timestamp: Matchers.iso8601DateTime(payload.timestamp),
    },
  })
}

export function addUuidInteraction<T extends UuidPayload>(
  data: Record<keyof T, unknown> & { __typename: string; id: number }
) {
  return addJsonInteraction({
    name: `fetch data of uuid ${data.id}`,
    given: `uuid ${data.id} is of type ${data.__typename}`,
    path: `/api/uuid/${data.id}`,
    body: data,
  })
}

export function addJsonInteraction({
  name,
  given,
  path,
  body,
}: {
  name: string
  given: string
  path: string
  body: unknown
}) {
  return global.pact.addInteraction({
    uponReceiving: name,
    state: given,
    withRequest: {
      method: 'GET',
      path,
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body,
    },
  })
}
