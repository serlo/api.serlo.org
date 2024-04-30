import gql from 'graphql-tag'
import { HttpResponse } from 'msw'
import * as R from 'ramda'

import {
  checkoutRevisionNotificationEvent,
  createCommentNotificationEvent,
  createEntityLinkNotificationEvent,
  createEntityNotificationEvent,
  createEntityRevisionNotificationEvent,
  createTaxonomyLinkNotificationEvent,
  createTaxonomyTermNotificationEvent,
  createThreadNotificationEvent,
  rejectRevisionNotificationEvent,
  removeEntityLinkNotificationEvent,
  removeTaxonomyLinkNotificationEvent,
  setLicenseNotificationEvent,
  setTaxonomyTermNotificationEvent,
  setThreadStateNotificationEvent,
  setUuidStateNotificationEvent,
  user,
} from '../../__fixtures__'
import { getTypenameAndId, given, Client } from '../__utils__'
import { Model } from '~/internals/graphql'
import { NotificationEventType } from '~/model/decoder'
import { Instance } from '~/types'

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

    await new Client()
      .prepareQuery({
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
      })
      .shouldReturnData({
        events: {
          nodes: R.reverse(allEvents).map(getTypenameAndId),
          pageInfo: { hasNextPage: false },
        },
      })
  })

  test('with filter "actorId"', async () => {
    const events = assignSequentialIds(
      R.concat(
        allEvents.map((event) => {
          return { ...event, actorId: 42 }
        }),
        allEvents.map((event) => {
          return { ...event, actorId: 23 }
        }),
      ),
    )
    setupEvents(events)

    await new Client()
      .prepareQuery({
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
      })
      .shouldReturnData({
        events: {
          nodes: R.reverse(
            events.slice(0, allEvents.length).map(getTypenameAndId),
          ),
        },
      })
  })

  test('with filter "actorUsername"', async () => {
    given('AliasQuery')
      .withPayload({
        instance: Instance.De,
        path: `/user/profile/${user.username}`,
      })
      .returns({
        id: 42,
        instance: Instance.De,
        path: `/user/42/${user.username}`,
      })
    const events = assignSequentialIds(
      R.concat(
        allEvents.map((event) => {
          return { ...event, actorId: 42 }
        }),
        allEvents.map((event) => {
          return { ...event, actorId: 23 }
        }),
      ),
    )
    setupEvents(events)

    await new Client()
      .prepareQuery({
        query: gql`
          query events($username: String!) {
            events(actorUsername: $username) {
              nodes {
                __typename
                id
              }
            }
          }
        `,
      })
      .withVariables({ username: user.username })
      .shouldReturnData({
        events: {
          nodes: R.reverse(
            events.slice(0, allEvents.length).map(getTypenameAndId),
          ),
        },
      })
  })

  test('with filter "instance"', async () => {
    const events = assignSequentialIds(
      R.concat(
        allEvents.map((event) => {
          return { ...event, instance: Instance.En }
        }),
        allEvents.map((event) => {
          return { ...event, instance: Instance.De }
        }),
      ),
    )
    setupEvents(events)

    await new Client()
      .prepareQuery({
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
      })
      .shouldReturnData({
        events: {
          nodes: R.reverse(
            events.slice(0, allEvents.length).map(getTypenameAndId),
          ),
        },
      })
  })

  test('with filter "objectId"', async () => {
    const events = assignSequentialIds(
      R.concat(
        allEvents.map((event) => {
          return { ...event, objectId: 42 }
        }),
        allEvents.map((event) => {
          return { ...event, objectId: 23 }
        }),
      ),
    )
    setupEvents(events)

    await new Client()
      .prepareQuery({
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
      })
      .shouldReturnData({
        events: {
          nodes: R.reverse(
            events.slice(0, allEvents.length).map(getTypenameAndId),
          ),
        },
      })
  })

  test('with filter `after`', async () => {
    const events = assignSequentialIds(
      R.range(0, 200).flatMap(R.always(allEvents)),
    )
    const afterId = R.reverse(events)[1000].id
    setupEvents(events)

    await new Client()
      .prepareQuery({
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
      })
      .withVariables({
        after: Buffer.from(afterId.toString()).toString('base64'),
      })
      .shouldReturnData({
        events: {
          nodes: R.reverse(events).slice(1001, 1501).map(getTypenameAndId),
          pageInfo: { hasNextPage: true },
        },
      })
  })

  test('`hasNextPage` is always true when database layer responses with hasNextPage == true', async () => {
    const events = assignSequentialIds(
      R.range(0, 105).flatMap(R.always(allEvents)),
    )
    const afterId = R.reverse(events)[1039].id
    setupEvents(events)

    await new Client()
      .prepareQuery({
        query: gql`
          query events($after: String!) {
            events(first: 10, after: $after) {
              pageInfo {
                hasNextPage
              }
            }
          }
        `,
      })
      .withVariables({
        after: Buffer.from(afterId.toString()).toString('base64'),
      })
      .shouldReturnData({
        events: { pageInfo: { hasNextPage: true } },
      })
  })

  test('number of returned events is bounded to 500 when `first` is undefined', async () => {
    const events = assignSequentialIds(
      R.range(0, 50).flatMap(R.always(allEvents)),
    )
    setupEvents(events)

    await new Client()
      .prepareQuery({
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
      })
      .shouldReturnData({
        events: {
          nodes: R.reverse(events).slice(0, 500).map(getTypenameAndId),
          pageInfo: { hasNextPage: true },
        },
      })
  })

  test('fails when first > 500', async () => {
    await new Client()
      .prepareQuery({
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
      })
      .shouldFailWithError('BAD_USER_INPUT')
  })
})

function setupEvents(allEvents: Model<'AbstractNotificationEvent'>[]) {
  given('EventsQuery').isDefinedBy(async ({ request }) => {
    const body = await request.json()
    const { after, objectId, actorId, first, instance } = body.payload

    const filteredEvents = [...allEvents]
      .reverse()
      .filter((event) => actorId == null || event.actorId === actorId)
      .filter((event) => instance == null || event.instance === instance)
      // We only filter for objectId here. However, the database layer
      // needs to check whether any event_uuid_parameter is also in the filter
      .filter((event) => objectId == null || event.objectId === objectId)
      .filter((event) => after == null || event.id < after)

    return HttpResponse.json({
      events: filteredEvents.slice(0, first),
      hasNextPage: filteredEvents.length > first,
    })
  })
}

function assignSequentialIds(
  events: Model<'AbstractNotificationEvent'>[],
): Model<'AbstractNotificationEvent'>[] {
  return events.map((event, id) => {
    return { ...event, id: id + 1 }
  })
}
