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
import { rest, ResponseResolver, restContext, MockedRequest } from 'msw'

import { LicensePayload } from '../../src/graphql/schema/license'
import { NotificationEventPayload } from '../../src/graphql/schema/notification'
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

export function createEventLogHandlers(
  events: (NotificationEventPayload | null)[]
) {
  return [
    createJsonHandler({
      path: '/api/current-event-id',
      body: { currentEventId: events.length },
    }),
    createApiHandler({
      path: '/api/event/:id',
      resolver(req, res, ctx) {
        const id = Number(req.params.id)-1

        return 0 <= id && id <= events.length
          ? res(ctx.json(events[id] as unknown as Record<string, unknown>))
          : res(ctx.status(404))
      },
    }),
  ]
}

export function createUuidHandler(uuid: UuidPayload) {
  return createJsonHandler({
    path: `/api/uuid/${uuid.id}`,
    body: uuid,
  })
}

export function createJsonHandler({
  instance,
  path,
  body,
}: {
  instance?: Instance
  path: string
  body: unknown
}) {
  return createApiHandler({
    instance,
    path,
    resolver(_req, res, ctx) {
      return res(ctx.status(200), ctx.json(body as Record<string, unknown>))
    },
  })
}

function createApiHandler({
  instance = Instance.De,
  path,
  resolver,
}: {
  instance?: Instance
  path: string
  resolver: ResponseResolver<MockedRequest, typeof restContext>
}) {
  const url = `http://${instance}.${process.env.SERLO_ORG_HOST}${path}`
  return rest.get(url, resolver)
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
