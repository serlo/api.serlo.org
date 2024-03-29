import { HttpResponse, ResponseResolver, http } from 'msw'
import * as R from 'ramda'

import { createFakeIdentity } from './services'
import { Model } from '~/internals/graphql'
import { DatabaseLayer } from '~/model'
import { Payload } from '~/model/database-layer'
import { DiscriminatorType } from '~/model/decoder'

const ForDefinitions = {
  UuidQuery(uuids: Model<'AbstractUuid'>[]) {
    for (const uuid of uuids) {
      if (uuid.__typename === DiscriminatorType.User) {
        global.kratos.identities.push(createFakeIdentity(uuid))
        // db layer doesn't have user.language, it should be fetched in kratos
        given('UuidQuery')
          .withPayload({ id: uuid.id })
          .returns({ ...uuid, language: undefined })
        continue
      }
      given('UuidQuery').withPayload({ id: uuid.id }).returns(uuid)
    }
  },
  EventQuery(events: Model<'AbstractNotificationEvent'>[]) {
    events.map((event) => {
      given('EventQuery').withPayload({ id: event.id }).returns(event)
    })
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
      }),
    )
    given('DeletedEntitiesQuery').isDefinedBy(async ({ request }) => {
      const body = await request.json()
      const { first, after, instance } = body.payload

      const entitiesByInstance = instance
        ? entities.filter((entity) => entity.instance === instance)
        : entities

      const entitiesByAfter = after
        ? entitiesByInstance.filter(
            (entity) => new Date(entity.date) > new Date(after),
          )
        : entitiesByInstance

      const entitiesByFirst = entitiesByAfter.slice(0, first)

      const deletedEntities = entitiesByFirst.map((entity) => {
        return {
          id: entity.id,
          dateOfDeletion: entity.date,
        }
      })
      return HttpResponse.json({ deletedEntities })
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
            }),
          )
        },
        returnsNotFound() {
          global.server.use(
            createMessageHandler({
              message: { type, payload },
              statusCode: 404,
              body: null,
            }),
          )
        },
        hasInternalServerError() {
          global.server.use(
            createMessageHandler({
              message: { type, payload },
              statusCode: 500,
              body: null,
            }),
          )
        },
        isDefinedBy(
          resolver: ResponseResolver<
            Record<string, unknown>,
            { payload: Payload<M> }
          >,
        ) {
          global.server.use(
            createDatabaseLayerHandler({
              matchType: type,
              matchPayloads: [payload],
              resolver,
            }),
          )
        },
      }
    },
    isDefinedBy(
      resolver: ResponseResolver<
        Record<string, unknown>,
        { payload: Payload<M> }
      >,
    ) {
      global.server.use(
        createDatabaseLayerHandler({ matchType: type, resolver }),
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
        }),
      )
    },
    returnsNotFound() {
      global.server.use(
        createMessageHandler({
          message: { type },
          statusCode: 404,
          body: null,
        }),
      )
    },
    hasInternalServerError() {
      global.server.use(
        createMessageHandler({ message: { type }, statusCode: 500 }),
      )
    },
    returnsBadRequest() {
      global.server.use(
        createMessageHandler({
          message: { type },
          statusCode: 400,
          body: { reason: 'bad request' },
        }),
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
    }),
  )

  given('ThreadsQuery')
    .withPayload({ id: uuid.id })
    .returns({ firstCommentIds })

  given('UuidQuery').for(uuid, firstComments, otherComments)
}

function createMessageHandler(
  args: {
    message: MessagePayload
    body?: unknown
    statusCode?: number
  },
  once = false,
) {
  const { message, body, statusCode } = args

  return createDatabaseLayerHandler({
    matchType: message.type,
    matchPayloads:
      message.payload === undefined ? undefined : [message.payload],
    resolver: () => {
      return HttpResponse.json(body === undefined ? [] : body, {
        status: statusCode ?? 200,
      })
    },
    options: { once },
  })
}

function createDatabaseLayerHandler<
  MessageType extends string = string,
  Payload = DefaultPayloadType,
>(args: {
  matchType: MessageType
  matchPayloads?: Partial<Payload>[]
  resolver: ResponseResolver<Record<string, unknown>, { payload: Payload }>
  options?: { once: boolean }
}) {
  const { matchType, matchPayloads, resolver, options } = args

  return http.post(
    getDatabaseLayerUrl({ path: '/' }),
    withTypeAndPayload(resolver, matchType, matchPayloads),
    options,
  )
}

function withTypeAndPayload<
  MessageType extends string = string,
  Payload = DefaultPayloadType,
>(
  resolver: ResponseResolver<Record<string, unknown>, { payload: Payload }>,
  expectedType: MessageType,
  expectedPayloads?: Partial<Payload>[],
): ResponseResolver<Record<string, unknown>, { payload: Payload }> {
  return async (args) => {
    const { request } = args

    // Ignore requests that have a non-JSON body.
    const contentType = request.headers.get('Content-Type') ?? ''
    if (!contentType.includes('application/json')) {
      return
    }

    // Clone the request and read it as JSON.
    const actualBody = (await request.clone().json()) as {
      type: string
      payload: Payload
    }

    const isTypeMatching = actualBody.type === expectedType
    const isPayloadMatching =
      expectedPayloads === undefined ||
      expectedPayloads.some((payload) =>
        R.equals({ ...actualBody.payload, ...payload }, actualBody.payload),
      )

    // Compare two objects using "lodash".
    if (!isTypeMatching || !isPayloadMatching) {
      return
    }

    // Without the `as` we get a TypeScript error which is a bug in
    // `msw` itself. Let's fix it at some point in the future :-)
    return resolver(args) as HttpResponse
  }
}

function getDatabaseLayerUrl({ path }: { path: string }) {
  return `http://${process.env.SERLO_ORG_DATABASE_LAYER_HOST}${path}`
}

interface MessagePayload<
  MessageType extends string = string,
  Payload = DefaultPayloadType,
> {
  type: MessageType
  payload?: Payload
}

type DefaultPayloadType = Record<string, unknown>

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
  const handler = http.get(url, ({ request }) => {
    if (
      request.headers.get('X-User-Id') !==
        process.env.ROCKET_CHAT_API_USER_ID ||
      request.headers.get('X-Auth-Token') !==
        process.env.ROCKET_CHAT_API_AUTH_TOKEN
    )
      return new HttpResponse(null, {
        status: 403,
      })

    return HttpResponse.json(body)
  })

  handler.predicate = ({ request }) => {
    return R.toPairs(parameters).every(([name, value]) => {
      const url = new URL(request.url)
      return url.searchParams.get(name) === value
    })
  }

  return handler
}
