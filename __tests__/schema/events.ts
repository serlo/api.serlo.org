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
import { gql } from 'apollo-server'
import * as R from 'ramda'

import {
  checkoutRevisionNotificationEvent,
  rejectRevisionNotificationEvent,
  createCommentNotificationEvent,
  createEntityNotificationEvent,
  createEntityLinkNotificationEvent,
  removeEntityLinkNotificationEvent,
  setLicenseNotificationEvent,
  setUuidStateNotificationEvent,
  createThreadNotificationEvent,
  createTaxonomyLinkNotificationEvent,
  createEntityRevisionNotificationEvent,
  removeTaxonomyLinkNotificationEvent,
  createTaxonomyTermNotificationEvent,
  setTaxonomyTermNotificationEvent,
  setThreadStateNotificationEvent,
  user,
  article,
} from '../../__fixtures__'
import {
  Client,
  createTestClient,
  assertSuccessfulGraphQLQuery,
  createDatabaseLayerHandler,
  createUuidHandler,
  getTypenameAndId,
  assertFailingGraphQLQuery,
} from '../__utils__'
import { Service } from '~/internals/authentication'
import { Model } from '~/internals/graphql'
import { NotificationEventType } from '~/model/decoder'
import { Instance } from '~/types'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.SerloCloudflareWorker,
    userId: user.id,
  })
})

const eventRepository: Record<
  NotificationEventType,
  Model<'AbstractNotificationEvent'>
> = {
  [NotificationEventType.CheckoutRevision]: checkoutRevisionNotificationEvent,
  [NotificationEventType.RejectRevision]: rejectRevisionNotificationEvent,
  [NotificationEventType.CreateComment]: createCommentNotificationEvent,
  [NotificationEventType.SetLicense]: setLicenseNotificationEvent,
  [NotificationEventType.CreateEntity]: createEntityNotificationEvent,
  [NotificationEventType.CreateTaxonomyLink]:
    createTaxonomyLinkNotificationEvent,
  [NotificationEventType.RemoveTaxonomyLink]:
    removeTaxonomyLinkNotificationEvent,
  [NotificationEventType.CreateThread]: createThreadNotificationEvent,
  [NotificationEventType.SetUuidState]: setUuidStateNotificationEvent,
  [NotificationEventType.CreateEntityLink]: createEntityLinkNotificationEvent,
  [NotificationEventType.RemoveEntityLink]: removeEntityLinkNotificationEvent,
  [NotificationEventType.CreateEntityRevision]:
    createEntityRevisionNotificationEvent,
  [NotificationEventType.CreateTaxonomyTerm]:
    createTaxonomyTermNotificationEvent,
  [NotificationEventType.SetTaxonomyTerm]: setTaxonomyTermNotificationEvent,
  [NotificationEventType.SetTaxonomyParent]: setTaxonomyTermNotificationEvent,
  [NotificationEventType.SetThreadState]: setThreadStateNotificationEvent,
}
const allEvents = assignSequentialIds(R.values(eventRepository))

describe('query endpoint "events"', () => {
  test('returns event log', async () => {
    setupEvents(allEvents)

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query events {
          events {
            nodes {
              __typename
              id
            }
            pageInfo {
              hasNextPage
            }
          }
        }
      `,
      client,
      data: {
        events: {
          nodes: R.reverse(allEvents).map(getTypenameAndId),
          pageInfo: { hasNextPage: false },
        },
      },
    })
  })

  test('with filter "actorId"', async () => {
    const events = assignSequentialIds(
      R.concat(
        allEvents.map(R.assoc('actorId', 42)),
        allEvents.map(R.assoc('actorId', 23))
      )
    )
    setupEvents(events)

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query events {
          events(actorId: 42) {
            nodes {
              __typename
              id
            }
          }
        }
      `,
      client,
      data: {
        events: {
          nodes: R.reverse(
            events.slice(0, allEvents.length).map(getTypenameAndId)
          ),
        },
      },
    })
  })

  test('with filter "instance"', async () => {
    const events = assignSequentialIds(
      R.concat(
        allEvents.map(R.assoc('instance', Instance.En)),
        allEvents.map(R.assoc('instance', Instance.De))
      )
    )
    setupEvents(events)

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query events {
          events(instance: en) {
            nodes {
              __typename
              id
            }
          }
        }
      `,
      client,
      data: {
        events: {
          nodes: R.reverse(
            events.slice(0, allEvents.length).map(getTypenameAndId)
          ),
        },
      },
    })
  })

  test('with filter "objectId"', async () => {
    const events = assignSequentialIds(
      R.concat(
        allEvents.map(R.assoc('objectId', 42)),
        allEvents.map(R.assoc('objectId', 23))
      )
    )
    setupEvents(events)

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query events {
          events(objectId: 42) {
            nodes {
              __typename
              id
            }
          }
        }
      `,
      client,
      data: {
        events: {
          nodes: R.reverse(
            events.slice(0, allEvents.length).map(getTypenameAndId)
          ),
        },
      },
    })
  })

  test('with filter `after`', async () => {
    const events = assignSequentialIds(
      R.range(0, 200).flatMap(R.always(allEvents))
    )
    const afterId = R.reverse(events)[1000].id
    setupEvents(events)

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query events($after: String!) {
          events(after: $after) {
            nodes {
              id
              __typename
            }
            pageInfo {
              hasNextPage
            }
          }
        }
      `,
      client,
      variables: { after: Buffer.from(afterId.toString()).toString('base64') },
      data: {
        events: {
          nodes: R.reverse(events).slice(1001, 1501).map(getTypenameAndId),
          pageInfo: { hasNextPage: true },
        },
      },
    })
  })

  test('`hasNextPage` is always true when database layer responses with hasNextPage == true', async () => {
    const events = assignSequentialIds(
      R.range(0, 105).flatMap(R.always(allEvents))
    )
    const afterId = R.reverse(events)[1039].id
    setupEvents(events)

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query events($after: String!) {
          events(first: 10, after: $after) {
            pageInfo {
              hasNextPage
            }
          }
        }
      `,
      client,
      variables: { after: Buffer.from(afterId.toString()).toString('base64') },
      data: { events: { pageInfo: { hasNextPage: true } } },
    })
  })

  test('number of returned events is bounded to 500 when `first` is undefined', async () => {
    const events = assignSequentialIds(
      R.range(0, 50).flatMap(R.always(allEvents))
    )
    setupEvents(events)

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query events {
          events {
            nodes {
              __typename
              id
            }
            pageInfo {
              hasNextPage
            }
          }
        }
      `,
      client,
      data: {
        events: {
          nodes: R.reverse(events).slice(0, 500).map(getTypenameAndId),
          pageInfo: { hasNextPage: true },
        },
      },
    })
  })

  test('fails when first > 500', async () => {
    const events = assignSequentialIds(
      R.range(0, 50).flatMap(R.always(allEvents))
    )
    setupEvents(events)

    await assertFailingGraphQLQuery({
      query: gql`
        query events {
          events(first: 600) {
            nodes {
              __typename
              id
            }
          }
        }
      `,
      message: 'first cannot be higher than 500',
      client,
    })
  })
})

test('User.eventsByUser returns events of this user', async () => {
  const events = assignSequentialIds(
    R.concat(
      allEvents.map(R.assoc('actorId', user.id)),
      allEvents.map(R.assoc('actorId', user.id + 1))
    )
  )
  setupEvents(events)
  global.server.use(createUuidHandler(user))

  await assertSuccessfulGraphQLQuery({
    query: gql`
      query userEvents($id: Int) {
        uuid(id: $id) {
          ... on User {
            eventsByUser {
              nodes {
                __typename
                id
              }
            }
          }
        }
      }
    `,
    variables: { id: user.id },
    client,
    data: {
      uuid: {
        eventsByUser: {
          nodes: R.reverse(
            events.slice(0, allEvents.length).map(getTypenameAndId)
          ),
        },
      },
    },
  })
})

test('AbstractEntity.events returns events for this entity', async () => {
  const uuid = { ...article, id: 42 }
  const events = assignSequentialIds(
    R.concat(
      allEvents.map(R.assoc('objectId', 42)),
      allEvents.map(R.assoc('objectId', 23))
    )
  )
  setupEvents(events)
  global.server.use(createUuidHandler(uuid))

  await assertSuccessfulGraphQLQuery({
    query: gql`
      query articleEvents($id: Int) {
        uuid(id: $id) {
          ... on Article {
            events {
              nodes {
                __typename
                id
              }
            }
          }
        }
      }
    `,
    variables: { id: uuid.id },
    client,
    data: {
      uuid: {
        events: {
          nodes: R.reverse(
            events.slice(0, events.length / 2).map(getTypenameAndId)
          ),
        },
      },
    },
  })
})

function setupEvents(allEvents: Model<'AbstractNotificationEvent'>[]) {
  global.server.use(
    createDatabaseLayerHandler<{
      after?: number
      objectId?: number
      actorId?: number
      instance: Instance
      first: number
    }>({
      matchType: 'EventsQuery',
      resolver(req, res, ctx) {
        const { after, objectId, actorId, first, instance } = req.body.payload

        const filteredEvents = [...allEvents]
          .reverse()
          .filter((event) => actorId == null || event.actorId === actorId)
          .filter((event) => instance == null || event.instance === instance)
          // We only filter for objectId here. However the database layer
          // needs to check whether any event_uuid_paramater is also in the filter
          .filter((event) => objectId == null || event.objectId === objectId)
          .filter((event) => after == null || event.id < after)

        return res(
          ctx.json({
            events: filteredEvents.slice(0, first),
            hasNextPage: filteredEvents.length > first,
          })
        )
      },
    })
  )
}

function assignSequentialIds(events: Model<'AbstractNotificationEvent'>[]) {
  return events.map((event, id) => R.assoc('id', id + 1, event))
}
