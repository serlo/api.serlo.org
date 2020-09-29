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
import { rest, MockedRequest } from 'msw'
import * as R from 'ramda'

import { LicensePayload } from '../../src/graphql/schema/license'
import {
  NotificationEventPayload,
  EventsPayload,
} from '../../src/graphql/schema/notification'
import {
  AliasPayload,
  NavigationPayload,
  UuidPayload,
} from '../../src/graphql/schema/uuid'
import { Instance } from '../../src/types'

export function createAliasHandler(alias: AliasPayload) {
  return createJsonHandler({
    instance: alias.instance,
    path: `/api/alias${alias.path}`,
    body: alias,
  })
}

export function createLicenseHandler(license: LicensePayload) {
  return createJsonHandler({
    instance: license.instance,
    path: `/api/license/${license.id}`,
    body: license,
  })
}

export function createNavigationHandler(navigation: NavigationPayload) {
  return createJsonHandler({
    instance: navigation.instance,
    path: '/api/navigation',
    body: navigation,
  })
}

export function createNotificationEventHandler(
  notificationEvent: NotificationEventPayload
) {
  return createJsonHandler({
    path: `/api/event/${notificationEvent.id}`,
    body: notificationEvent,
  })
}

export function createEventsHandler(
  { eventIds = [], totalCount, pageInfo }: Partial<EventsPayload>,
  query?: Record<string, string>
) {
  return createJsonHandler({
    path: '/api/events',
    query,
    body: {
      eventIds,
      totalCount: totalCount ?? eventIds.length,
      pageInfo: {
        hasNextPage: pageInfo?.hasNextPage ?? false,
        hasPreviousPage: pageInfo?.hasPreviousPage ?? false,
        startCursor: pageInfo?.startCursor ?? eventIds[0] ?? null,
        endCursor: pageInfo?.endCursor ?? R.last(eventIds) ?? null,
      },
    },
  })
}

export function createUuidHandler(uuid: UuidPayload) {
  return createJsonHandler({
    path: `/api/uuid/${uuid.id}`,
    body: uuid,
  })
}

export function createJsonHandler({
  instance = Instance.De,
  path,
  query = {},
  body,
}: {
  instance?: Instance
  path: string
  query?: Record<string, string>
  body: unknown
}) {
  return rest.get(
    `http://${instance}.${process.env.SERLO_ORG_HOST}${path}`,
    (req: MockedRequest, res, ctx) => {
      return R.toPairs(query).every(([key, value]) => {
        return req.url.searchParams.get(key) === value
      })
        ? res(ctx.status(200), ctx.json(body as Record<string, unknown>))
        : res(ctx.status(400))
    }
  )
}

export function createSpreadsheetHandler({
  spreadsheetId,
  range,
  majorDimension,
  apiKey,
  status = 200,
  body = {},
}: {
  spreadsheetId: string
  range: string
  majorDimension: string
  apiKey: string
  status?: number
  body?: Record<string, unknown>
}) {
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}` +
    `/values/${range}?majorDimension=${majorDimension}&key=${apiKey}`
  return rest.get(url, (_req, res, ctx) =>
    res.once(ctx.status(status), ctx.json(body))
  )
}
