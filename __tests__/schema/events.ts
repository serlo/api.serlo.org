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
} from '../../__fixtures__'
import {
  Client,
  createTestClient,
  assertSuccessfulGraphQLQuery,
  createDatabaseLayerHandler,
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
  [NotificationEventType.CreateTaxonomyLink]: createTaxonomyLinkNotificationEvent,
  [NotificationEventType.RemoveTaxonomyLink]: removeTaxonomyLinkNotificationEvent,
  [NotificationEventType.CreateThread]: createThreadNotificationEvent,
  [NotificationEventType.SetUuidState]: setUuidStateNotificationEvent,
  [NotificationEventType.CreateEntityLink]: createEntityLinkNotificationEvent,
  [NotificationEventType.RemoveEntityLink]: removeEntityLinkNotificationEvent,
  [NotificationEventType.CreateEntityRevision]: createEntityRevisionNotificationEvent,
  [NotificationEventType.CreateTaxonomyTerm]: createTaxonomyTermNotificationEvent,
  [NotificationEventType.SetTaxonomyTerm]: setTaxonomyTermNotificationEvent,
  [NotificationEventType.SetTaxonomyParent]: setTaxonomyTermNotificationEvent,
  [NotificationEventType.SetThreadState]: setThreadStateNotificationEvent,
}
const allEvents = updateIds(R.values(eventRepository))

describe('query endpoint "events"', () => {
  test('returns event log', async () => {
    setupEvents(allEvents, { maxReturn: 5 })

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query events {
          events {
            nodes {
              __typename
              id
            }
          }
        }
      `,
      client,
      data: { events: { nodes: allEvents.map(getTypenameAndId) } },
    })
  })

  test('with filter "userId"', async () => {
    const events = updateIds(
      R.concat(
        allEvents.map(R.assoc('actorId', 42)),
        allEvents.map(R.assoc('actorId', 23))
      )
    )
    setupEvents(events)

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query events {
          events(userId: 42) {
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
          nodes: events.slice(0, allEvents.length).map(getTypenameAndId),
        },
      },
    })
  })

  test('with filter "instance"', async () => {
    const events = updateIds(
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
          nodes: events.slice(0, allEvents.length).map(getTypenameAndId),
        },
      },
    })
  })

  describe('number of returned events is bounded to 100', () => {
    let events: Model<'AbstractNotificationEvent'>[]

    beforeEach(() => {
      events = updateIds(R.range(0, 10).flatMap(R.always(allEvents)))
      setupEvents(events)
    })

    test('when first is defined', async () => {
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query events {
            events(first: 150) {
              nodes {
                __typename
                id
              }
            }
          }
        `,
        client,
        data: { events: { nodes: events.slice(0, 100).map(getTypenameAndId) } },
      })
    })

    test('when last is defined', async () => {
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query events {
            events(last: 150) {
              nodes {
                __typename
                id
              }
            }
          }
        `,
        client,
        data: { events: { nodes: events.slice(-100).map(getTypenameAndId) } },
      })
    })

    test('when first and last is not defined', async () => {
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query events {
            events {
              nodes {
                __typename
                id
              }
            }
          }
        `,
        client,
        data: { events: { nodes: events.slice(0, 100).map(getTypenameAndId) } },
      })
    })
  })
})

function setupEvents(
  events: Model<'AbstractNotificationEvent'>[],
  options?: {
    maxReturn?: number
  }
) {
  const maxReturn = options?.maxReturn ?? events.length / 2 + 1

  global.server.use(
    createDatabaseLayerHandler<{ after?: number }>({
      matchMessage: { type: 'EventsQuery' },
      resolver(req, res, ctx) {
        const { after } = req.body.payload

        if (after == null) {
          return res(ctx.json({ events: events.slice(0, maxReturn) }))
        }

        const index = events.findIndex((e) => e.id === after)

        if (index < 0) return res(ctx.status(400))

        const updatedEvents = events.slice(index + 1, index + 1 + maxReturn)

        return res(ctx.json({ events: updatedEvents }))
      },
    })
  )
}

function getTypenameAndId(event: Model<'AbstractNotificationEvent'>) {
  return R.pick(['__typename', 'id'], event)
}

function updateIds(events: Model<'AbstractNotificationEvent'>[]) {
  return events.map((event, id) => R.assoc('id', id + 1, event))
}
