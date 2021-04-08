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
import { rest } from 'msw'
import * as R from 'ramda'

import { RestResolver } from './services'
import { Model } from '~/internals/graphql'
import { Payload } from '~/internals/model/types'
import { NavigationPayload } from '~/schema/uuid/abstract-navigation-child/types'

export function createAliasHandler(alias: Payload<'serlo', 'getAlias'>) {
  return createMessageHandler({
    message: {
      type: 'AliasQuery',
      payload: {
        instance: alias.instance,
        path: alias.path,
      },
    },
    body: alias,
  })
}

export function createLicenseHandler(license: Model<'License'>) {
  return createMessageHandler({
    message: {
      type: 'LicenseQuery',
      payload: {
        id: license.id,
      },
    },
    body: license,
  })
}

export function createNavigationHandler(navigation: NavigationPayload) {
  return createMessageHandler({
    message: {
      type: 'NavigationQuery',
      payload: { instance: navigation.instance },
    },
    body: navigation,
  })
}

export function createNotificationEventHandler(
  notificationEvent: Model<'AbstractNotificationEvent'>
) {
  return createMessageHandler({
    message: {
      type: 'EventQuery',
      payload: {
        id: notificationEvent.id,
      },
    },
    body: notificationEvent,
  })
}

export function createUuidHandler(uuid: Model<'AbstractUuid'>, once?: boolean) {
  return createMessageHandler(
    {
      message: {
        type: 'UuidQuery',
        payload: { id: uuid.id },
      },
      body: uuid,
    },
    once
  )
}

export function createMessageHandler(
  args: {
    message: MessagePayload
    body?: unknown
    statusCode?: number
  },
  once = false
) {
  const { message, body, statusCode } = args

  return createDatabaseLayerHandler({
    matchMessage: message,
    resolver: (_req, res, ctx) => {
      return (once ? res.once : res)(
        ctx.status(statusCode ?? 200),
        ...(body === undefined
          ? []
          : [ctx.json(body as Record<string, unknown>)])
      )
    },
  })
}

export function createDatabaseLayerHandler<Payload = DefaultPayloadType>(args: {
  matchMessage: MessagePayload<Payload>
  resolver: RestResolver<Required<MessagePayload<Payload>>>
}) {
  const { matchMessage, resolver } = args

  const handler = rest.post(getDatabaseLayerUrl({ path: '/' }), resolver)

  // Only use this handler if message matches
  handler.predicate = (req) =>
    req.body.type === matchMessage.type &&
    (matchMessage.payload === undefined ||
      R.equals(req.body.payload, matchMessage.payload))

  return handler
}

function getDatabaseLayerUrl({ path }: { path: string }) {
  return `http://${process.env.SERLO_ORG_DATABASE_LAYER_HOST}${path}`
}

interface MessagePayload<Payload = DefaultPayloadType> {
  type: string
  payload?: Payload
}

type DefaultPayloadType = Record<string, unknown>

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
