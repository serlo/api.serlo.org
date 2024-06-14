import gql from 'graphql-tag'

import {
  article,
  comment,
  user,
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
  setTaxonomyParentNotificationEvent,
  setTaxonomyTermNotificationEvent,
  setThreadStateNotificationEvent,
  setUuidStateNotificationEvent,
} from '../../__fixtures__'
import { Client } from '../__utils__'
import { NotificationEventType } from '~/model/decoder'
import { createEvent } from '~/schema/events/event'
import { encodeThreadId } from '~/schema/thread/utils'
import { Instance } from '~/types'

const basePayload = {
  __typename: NotificationEventType.CreateComment,
  actorId: user.id,
  instance: Instance.De,
  threadId: article.id,
  commentId: comment.id,
} as const

describe('creates event successfully with right payload', () => {
  const events = [
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
    setTaxonomyParentNotificationEvent,
    setTaxonomyTermNotificationEvent,
    setThreadStateNotificationEvent,
    setUuidStateNotificationEvent,
  ] as const

  const testCases: [string, (typeof events)[number]][] = events.map((event) => [
    event.__typename,
    event,
  ])

  test.each(testCases)('%s', async (_, event) => {
    const initialEventsNumber = await getEventsNumber()

    await createEvent(event, getContext())

    const lastEvent = await getLastEvent()

    expect(lastEvent).toEqual(getApiResult(event))

    const finalEventsNumber = await getEventsNumber()
    expect(finalEventsNumber).toEqual(initialEventsNumber + 1)
  })
})

test('adds a notification', async () => {
  await createEvent(checkoutRevisionNotificationEvent, getContext())

  const lastEvent = await getLastEvent()

  expect(
    await databaseForTests.fetchAll(
      'select * from notification_event where event_id = ?',
      [lastEvent.id],
    ),
  ).not.toHaveLength(0)
  // TODO: be sure the notifications are set to right users and objects
})

test('fails if actor does not exist', async () => {
  await expect(
    createEvent({ ...basePayload, actorId: 5 }, getContext()),
  ).rejects.toThrow()
})

test('fails if object does not exist', async () => {
  await expect(
    createEvent({ ...basePayload, threadId: 0 }, getContext()),
  ).rejects.toThrow()
})

test('fails if uuid number in parameters does not exist', async () => {
  await expect(
    createEvent({ ...basePayload, threadId: 40000 }, getContext()),
  ).rejects.toThrow()
})

async function getLastEvent() {
  const data = (await new Client()
    .prepareQuery({
      query: gql`
        query {
          events(last: 1) {
            nodes {
              id
              instance
              date
              __typename
              actor {
                id
              }
              objectId

              ... on CheckoutRevisionNotificationEvent {
                repository {
                  id
                }
                revision {
                  id
                }
                reason
              }

              ... on CreateCommentNotificationEvent {
                thread {
                  id
                }
                comment {
                  id
                }
              }

              ... on CreateEntityNotificationEvent {
                entity {
                  id
                }
              }

              ... on CreateEntityLinkNotificationEvent {
                parent {
                  id
                }
                child {
                  id
                }
              }

              ... on CreateEntityRevisionNotificationEvent {
                entity {
                  id
                }
                entityRevision {
                  id
                }
              }

              ... on CreateTaxonomyTermNotificationEvent {
                taxonomyTerm {
                  id
                }
              }

              ... on CreateTaxonomyLinkNotificationEvent {
                parent {
                  id
                }
                child {
                  id
                }
              }

              ... on CreateThreadNotificationEvent {
                thread {
                  id
                }
              }

              ... on RejectRevisionNotificationEvent {
                repository {
                  id
                }
                revision {
                  id
                }
                reason
              }

              ... on RemoveEntityLinkNotificationEvent {
                parent {
                  id
                }
                child {
                  id
                }
              }

              ... on RemoveTaxonomyLinkNotificationEvent {
                parent {
                  id
                }
                child {
                  id
                }
              }

              ... on SetTaxonomyParentNotificationEvent {
                previousParent {
                  id
                }
                _parent: parent {
                  id
                }
                child {
                  id
                }
              }

              ... on SetTaxonomyTermNotificationEvent {
                taxonomyTerm {
                  id
                }
              }

              ... on SetLicenseNotificationEvent {
                repository {
                  id
                }
              }

              ... on SetThreadStateNotificationEvent {
                thread {
                  id
                }
                archived
              }

              ... on SetUuidStateNotificationEvent {
                trashed
              }
            }
          }
        }
      `,
    })
    .getData()) as { events: { nodes: unknown[] } }

  const event = data.events.nodes[0] as { id: number; parent: unknown }

  // In the GraphQL query "parent" is included with conflicting types, so that
  // we sometimes use "_parent" instead. This is a workaround to make the GraphQL
  // query work.
  if ('_parent' in event) {
    event.parent = event._parent
    delete event._parent
  }

  return event
}

function getApiResult(event: Record<string, unknown>): Record<string, unknown> {
  const apiResult: Record<string, unknown> = {}

  for (const key in event) {
    if (key === 'id') {
      apiResult[key] = expect.any(Number)
    } else if (key === 'date') {
      apiResult[key] = expect.any(String)
    } else if (key === 'threadId') {
      apiResult['thread'] = { id: encodeThreadId(event[key] as number) }
    } else if (key.endsWith('Id') && key !== 'objectId') {
      apiResult[key.slice(0, -2)] = { id: event[key] }
    } else if (key.endsWith('Ids')) {
      const value = event[key]

      if (Array.isArray(value)) {
        apiResult[key] = { nodes: value.map((id: unknown) => ({ id })) }
      }
    } else {
      apiResult[key] = event[key]
    }
  }
  return apiResult
}

async function getEventsNumber() {
  return (
    await global.databaseForTests.fetchOne<{ n: number }>(
      'SELECT count(*) AS n FROM event',
    )
  ).n
}

function getContext() {
  return { database: global.databaseForTests }
}
