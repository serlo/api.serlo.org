/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { MockedRequest, rest } from 'msw'
import * as R from 'ramda'

import { Database } from './database'
import { RestResolver } from './services'
import { Model } from '~/internals/graphql'
import { Payload } from '~/internals/model'
import { DatabaseLayer } from '~/model'
import { Uuid } from '~/model/decoder'

export function given<M extends DatabaseLayer.Message>(message: M) {
  return {
    withPayload(payload: DatabaseLayer.Payload<M>) {
      return {
        returns(response: DatabaseLayer.Response<M>) {
          global.server.use(
            createMessageHandler({
              message: { type: message, payload },
              statusCode: 200,
              body: response,
            })
          )
        },
      }
    },
    returnsNotFound() {
      global.server.use(
        createMessageHandler({
          message: { type: message },
          statusCode: 404,
          body: null,
        })
      )
    },
    hasInternalServerError() {
      global.server.use(
        createMessageHandler({ message: { type: message }, statusCode: 500 })
      )
    },
    returnsBadRequest() {
      global.server.use(
        createMessageHandler({
          message: { type: message },
          statusCode: 400,
          body: { reason: 'bad request' },
        })
      )
    },
  }
}

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

export function createNavigationHandler(
  navigation: Payload<'serlo', 'getNavigationPayload'>
) {
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

export function createSubjectsHandler(subjects: Model<'TaxonomyTerm'>[]) {
  return createMessageHandler({
    message: { type: 'SubjectsQuery', payload: {} },
    body: {
      subjects: subjects.map((taxonomyTerm) => {
        return {
          taxonomyTermId: taxonomyTerm.id,
          instance: taxonomyTerm.instance,
        }
      }),
    },
  })
}

export function createUnrevisedEntitiesHandler(
  entities: Model<'AbstractEntity'>[]
) {
  return createMessageHandler({
    message: { type: 'UnrevisedEntitiesQuery', payload: {} },
    body: { unrevisedEntityIds: entities.map((entity) => entity.id) },
  })
}

export function createActivityByTypeHandler({
  userId,
  activityByType,
}: {
  userId: number
  activityByType: Payload<'serlo', 'getActivityByType'>
}) {
  return createMessageHandler({
    message: { type: 'ActivityByTypeQuery', payload: { userId } },
    body: activityByType,
  })
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
    matchType: message.type,
    matchPayloads:
      message.payload === undefined ? undefined : [message.payload],
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

export function givenUuidQueryEndpoint(
  resolver: MessageResolver<{ id: number }>
) {
  givenSerloEndpoint('UuidQuery', resolver)
}

export function returnsUuidsFromDatabase(
  database: Database
): RestResolver<BodyType<{ id: number }>> {
  return (req, res, ctx) => {
    const uuid = database.getUuid(req.body.payload.id)

    return uuid ? res(ctx.json(uuid)) : res(ctx.json(null), ctx.status(404))
  }
}

export function givenEntityCheckoutRevisionEndpoint(
  resolver: MessageResolver<{
    revisionId: Uuid
    reason: string
    userId: number
  }>
) {
  givenSerloEndpoint('EntityCheckoutRevisionMutation', resolver)
}

export function givenPageCheckoutRevisionEndpoint(
  resolver: MessageResolver<{
    revisionId: Uuid
    reason: string
    userId: number
  }>
) {
  givenSerloEndpoint('PageCheckoutRevisionMutation', resolver)
}

export function givenEntityRejectRevisionEndpoint(
  resolver: MessageResolver<{
    revisionId: Uuid
    reason: string
    userId: number
  }>
) {
  givenSerloEndpoint('EntityRejectRevisionMutation', resolver)
}

export function givenPageRejectRevisionEndpoint(
  resolver: MessageResolver<{
    revisionId: Uuid
    reason: string
    userId: number
  }>
) {
  givenSerloEndpoint('PageRejectRevisionMutation', resolver)
}

export function givenSerloEndpoint<Payload = DefaultPayloadType>(
  matchType: string,
  resolver: MessageResolver<Payload>
) {
  global.server.use(
    createDatabaseLayerHandler<Payload>({ matchType, resolver })
  )
}

export function createDatabaseLayerHandler<Payload = DefaultPayloadType>(args: {
  matchType: string
  matchPayloads?: Payload[]
  resolver: MessageResolver<Payload>
}) {
  const { matchType, matchPayloads, resolver } = args

  const handler = rest.post(getDatabaseLayerUrl({ path: '/' }), resolver)

  // Only use this handler if message matches
  handler.predicate = (req: MockedRequest<BodyType<Payload>>) =>
    req?.body?.type === matchType &&
    (matchPayloads === undefined ||
      matchPayloads.some((payload) => R.equals(req.body.payload, payload)))

  return handler
}

function getDatabaseLayerUrl({ path }: { path: string }) {
  return `http://${process.env.SERLO_ORG_DATABASE_LAYER_HOST}${path}`
}

export type MessageResolver<Payload = DefaultPayloadType> = RestResolver<
  BodyType<Payload>
>
type BodyType<Payload = DefaultPayloadType> = Required<MessagePayload<Payload>>

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

export function createChatUsersInfoHandler({
  username,
  success,
}: {
  username: string
  success: boolean
}) {
  return createCommunityChatHandler({
    endpoint: 'users.info',
    parameters: { username },
    body: { success },
  })
}

function createCommunityChatHandler({
  endpoint,
  parameters,
  body,
}: {
  endpoint: string
  parameters: Record<string, string>
  body: Record<string, unknown>
}) {
  const url = `${process.env.ROCKET_CHAT_URL}api/v1/${endpoint}`
  const handler = rest.get(url, (req, res, ctx) => {
    if (
      req.headers.get('X-User-Id') !== process.env.ROCKET_CHAT_API_USER_ID ||
      req.headers.get('X-Auth-Token') !== process.env.ROCKET_CHAT_API_AUTH_TOKEN
    )
      return res(ctx.status(403))

    return res(ctx.json(body))
  })

  handler.predicate = (req: MockedRequest) => {
    return R.toPairs(parameters).every(
      ([name, value]) => req.url.searchParams.get(name) === value
    )
  }

  return handler
}
