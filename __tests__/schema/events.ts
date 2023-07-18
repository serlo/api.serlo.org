import { gql } from 'apollo-server'
import * as R from 'ramda'

import {
  article,
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
import { castToUuid, NotificationEventType } from '~/model/decoder'
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
          return { ...event, actorId: castToUuid(42) }
        }),
        allEvents.map((event) => {
          return { ...event, actorId: castToUuid(23) }
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
          return { ...event, objectId: castToUuid(42) }
        }),
        allEvents.map((event) => {
          return { ...event, objectId: castToUuid(23) }
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

test('User.eventsByUser returns events of this user', async () => {
  const events = assignSequentialIds(
    R.concat(
      allEvents.map((event) => {
        return { ...event, actorId: user.id }
      }),
      allEvents.map((event) => {
        return { ...event, actorId: castToUuid(23) }
      }),
    ),
  )
  setupEvents(events)
  given('UuidQuery').for(user)

  await new Client()
    .prepareQuery({
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
    })
    .withVariables({ id: user.id })
    .shouldReturnData({
      uuid: {
        eventsByUser: {
          nodes: R.reverse(
            events.slice(0, allEvents.length).map(getTypenameAndId),
          ),
        },
      },
    })
})

test('AbstractEntity.events returns events for this entity', async () => {
  const events = assignSequentialIds(
    R.concat(
      allEvents.map((event) => {
        return { ...event, objectId: article.id }
      }),
      allEvents.map((event) => {
        return { ...event, objectId: castToUuid(23) }
      }),
    ),
  )
  setupEvents(events)
  given('UuidQuery').for(article)

  await new Client()
    .prepareQuery({
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
    })
    .withVariables({ id: article.id })
    .shouldReturnData({
      uuid: {
        events: {
          nodes: R.reverse(
            events.slice(0, events.length / 2).map(getTypenameAndId),
          ),
        },
      },
    })
})

function setupEvents(allEvents: Model<'AbstractNotificationEvent'>[]) {
  given('EventsQuery').isDefinedBy((req, res, ctx) => {
    const { after, objectId, actorId, first, instance } = req.body.payload

    const filteredEvents = [...allEvents]
      .reverse()
      .filter((event) => actorId == null || event.actorId === actorId)
      .filter((event) => instance == null || event.instance === instance)
      // We only filter for objectId here. However, the database layer
      // needs to check whether any event_uuid_parameter is also in the filter
      .filter((event) => objectId == null || event.objectId === objectId)
      .filter((event) => after == null || event.id < after)

    return res(
      ctx.json({
        events: filteredEvents.slice(0, first),
        hasNextPage: filteredEvents.length > first,
      }),
    )
  })
}

function assignSequentialIds(
  events: Model<'AbstractNotificationEvent'>[],
): Model<'AbstractNotificationEvent'>[] {
  return events.map((event, id) => {
    return { ...event, id: castToUuid(id + 1) }
  })
}
