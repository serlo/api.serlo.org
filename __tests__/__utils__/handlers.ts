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
import { DatabaseLayer } from '~/model'
import { Uuid } from '~/model/decoder'

const ForDefinitions = {
  UuidQuery(uuids: Model<'AbstractUuid'>[]) {
    for (const uuid of uuids) {
      given('UuidQuery').withPayload({ id: uuid.id }).returns(uuid)
    }
  },
  SubjectsQuery(terms: Model<'TaxonomyTerm'>[]) {
    given('SubjectsQuery')
      .withPayload({})
      .returns({
        subjects: terms.map((term) => {
          return { taxonomyTermId: term.id, instance: term.instance }
        }),
      })
  },
  UnrevisedEntitiesQuery(entities: Model<'AbstractEntity'>[]) {
    given('UnrevisedEntitiesQuery')
      .withPayload({})
      .returns({ unrevisedEntityIds: entities.map((entity) => entity.id) })
  },
  DeletedEntitiesQuery(entities: Model<'AbstractEntity'>[]) {
    given('UuidQuery').for(
      entities.map((entity) => {
        return { ...entity, trashed: true }
      })
    )
    given('DeletedEntitiesQuery').isDefinedBy((req, res, ctx) => {
      const { first, after, instance } = req.body.payload

      const entitiesByInstance = instance
        ? entities.filter((entity) => entity.instance === instance)
        : entities

      const entitiesByAfter = after
        ? entitiesByInstance.filter(
            (entity) => new Date(entity.date) > new Date(after)
          )
        : entitiesByInstance

      const entitiesByFirst = entitiesByAfter.slice(0, first)

      const deletedEntities = entitiesByFirst.map((entity) => {
        return {
          id: entity.id,
          dateOfDeletion: entity.date,
        }
      })
      return res(ctx.json({ deletedEntities }))
    })
  },
}
type ForDefinitions = typeof ForDefinitions
type ForArg<M> = M extends keyof ForDefinitions
  ? Parameters<ForDefinitions[M]>[0][number]
  : never

export function given<M extends DatabaseLayer.MessageType>(type: M) {
  return {
    withPayload(payload: Partial<DatabaseLayer.Payload<M>>) {
      return {
        returns(response: DatabaseLayer.Response<M>) {
          global.server.use(
            createMessageHandler({
              message: { type, payload },
              statusCode: 200,
              body: response,
            })
          )
        },
        returnsNotFound() {
          global.server.use(
            createMessageHandler({
              message: { type, payload },
              statusCode: 404,
              body: null,
            })
          )
        },
        hasInternalServerError() {
          global.server.use(
            createMessageHandler({
              message: { type, payload },
              statusCode: 500,
              body: null,
            })
          )
        },
        isDefinedBy(resolver: MessageResolver<M, DatabaseLayer.Payload<M>>) {
          global.server.use(
            createDatabaseLayerHandler({
              matchType: type,
              matchPayloads: [payload],
              resolver,
            })
          )
        },
      }
    },
    isDefinedBy(resolver: MessageResolver<M, DatabaseLayer.Payload<M>>) {
      global.server.use(
        createDatabaseLayerHandler({ matchType: type, resolver })
      )
    },
    for(...args: (ForArg<M> | ForArg<M>[])[]) {
      // FIXME This is just ugly... :-(
      const defs = ForDefinitions as { [K in M]?: (x: ForArg<M>[]) => void }
      const func = defs[type]

      if (typeof func === 'function') {
        func(args.flatMap((x) => (Array.isArray(x) ? x : [x])))
      }
    },
    returns(response: DatabaseLayer.Response<M>) {
      global.server.use(
        createMessageHandler({
          message: { type },
          statusCode: 200,
          body: response,
        })
      )
    },
    returnsNotFound() {
      global.server.use(
        createMessageHandler({ message: { type }, statusCode: 404, body: null })
      )
    },
    hasInternalServerError() {
      global.server.use(
        createMessageHandler({ message: { type }, statusCode: 500 })
      )
    },
    returnsBadRequest() {
      global.server.use(
        createMessageHandler({
          message: { type },
          statusCode: 400,
          body: { reason: 'bad request' },
        })
      )
    },
  }
}

export function givenThreads({
  uuid,
  threads,
}: {
  uuid: Model<'AbstractUuid'>
  threads: Model<'Comment'>[][]
}) {
  const firstCommentIds = threads.map((thread) => thread[0].id)
  const firstComments = threads.map((thread) => {
    const childrenIds = thread.slice(1).map(R.prop('id'))

    return { ...thread[0], parentId: uuid.id, childrenIds }
  })
  const otherComments = threads.flatMap((thread) =>
    thread.slice(1).map((comment) => {
      return { ...comment, parentId: thread[0].id, childrenIds: [] }
    })
  )

  given('ThreadsQuery')
    .withPayload({ id: uuid.id })
    .returns({ firstCommentIds })

  given('UuidQuery').for(uuid, firstComments, otherComments)
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

export function returnsUuidsFromDatabase(
  database: Database
): RestResolver<BodyType<string, { id: number }>> {
  return (req, res, ctx) => {
    const uuid = database.getUuid(req.body.payload.id)

    return uuid ? res(ctx.json(uuid)) : res(ctx.json(null), ctx.status(404))
  }
}

export function givenEntityCheckoutRevisionEndpoint(
  resolver: MessageResolver<
    string,
    {
      revisionId: Uuid
      reason: string
      userId: number
    }
  >
) {
  givenSerloEndpoint('EntityCheckoutRevisionMutation', resolver)
}

export function givenPageCheckoutRevisionEndpoint(
  resolver: MessageResolver<
    string,
    {
      revisionId: Uuid
      reason: string
      userId: number
    }
  >
) {
  givenSerloEndpoint('PageCheckoutRevisionMutation', resolver)
}

export function givenEntityRejectRevisionEndpoint(
  resolver: MessageResolver<
    string,
    {
      revisionId: Uuid
      reason: string
      userId: number
    }
  >
) {
  givenSerloEndpoint('EntityRejectRevisionMutation', resolver)
}

export function givenPageRejectRevisionEndpoint(
  resolver: MessageResolver<
    string,
    {
      revisionId: Uuid
      reason: string
      userId: number
    }
  >
) {
  givenSerloEndpoint('PageRejectRevisionMutation', resolver)
}

export function givenSerloEndpoint<Payload = DefaultPayloadType>(
  matchType: string,
  resolver: MessageResolver<string, Payload>
) {
  global.server.use(
    createDatabaseLayerHandler<string, Payload>({ matchType, resolver })
  )
}

export function createDatabaseLayerHandler<
  MessageType extends string = string,
  Payload = DefaultPayloadType
>(args: {
  matchType: MessageType
  matchPayloads?: Partial<Payload>[]
  resolver: MessageResolver<MessageType, Payload>
}) {
  const { matchType, matchPayloads, resolver } = args

  const handler = rest.post(getDatabaseLayerUrl({ path: '/' }), resolver)

  // Only use this handler if message matches
  handler.predicate = (req: MockedRequest<BodyType<MessageType, Payload>>) =>
    req?.body?.type === matchType &&
    (matchPayloads === undefined ||
      matchPayloads.some((payload) =>
        R.equals({ ...req.body.payload, ...payload }, req.body.payload)
      ))

  return handler
}

function getDatabaseLayerUrl({ path }: { path: string }) {
  return `http://${process.env.SERLO_ORG_DATABASE_LAYER_HOST}${path}`
}

export type MessageResolver<
  MessageType extends string = string,
  Payload = DefaultPayloadType
> = RestResolver<BodyType<MessageType, Payload>>
type BodyType<
  MessageType extends string = string,
  Payload = DefaultPayloadType
> = Required<MessagePayload<MessageType, Payload>>

interface MessagePayload<
  MessageType extends string = string,
  Payload = DefaultPayloadType
> {
  type: MessageType
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
