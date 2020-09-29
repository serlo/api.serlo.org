import { gql } from 'apollo-server'

import {
  user,
  createEntityNotificationEvent,
  createTaxonomyTermNotificationEvent,
  getAbstractNotificationEventDataWithoutSubResolvers,
} from '../../__fixtures__'
import { Service } from '../../src/graphql/schema/types'
import {
  createTestClient,
  Client,
  createNotificationEventHandler,
  createEventsHandler,
  assertSuccessfulGraphQLQuery,
} from '../__utils__'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: user.id,
  }).client
})

describe('events', () => {
  const event1 = { ...createEntityNotificationEvent, id: 1 }
  const event2 = { ...createTaxonomyTermNotificationEvent, id: 2 }

  test('returns list of current events', async () => {
    global.server.use(
      createNotificationEventHandler(event1),
      createNotificationEventHandler(event2),
      createEventsHandler({ eventIds: [2, 1] })
    )

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query events {
          events {
            totalCount
            nodes {
              ... on AbstractNotificationEvent {
                __typename
                id
                instance
                date
              }
            }
          }
        }
      `,
      data: {
        events: {
          totalCount: 2,
          nodes: [
            getAbstractNotificationEventDataWithoutSubResolvers(event2),
            getAbstractNotificationEventDataWithoutSubResolvers(event1),
          ],
        },
      },
      client,
    })
  })

  test('forwards results of serlo.org', async () => {
    global.server.use(
      createEventsHandler({
        totalCount: 100,
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: true,
          startCursor: 10,
          endCursor: 10,
        },
      })
    )

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query events {
          events {
            totalCount
            pageInfo {
              hasPreviousPage
              hasNextPage
              startCursor
              endCursor
            }
          }
        }
      `,
      data: {
        events: {
          totalCount: 100,
          pageInfo: {
            hasNextPage: true,
            hasPreviousPage: true,
            startCursor: 'MTA=',
            endCursor: 'MTA=',
          },
        },
      },
      client,
    })
  })

  test('forwards results of serlo.org (start and end cursor is null)', async () => {
    global.server.use(
      createEventsHandler({
        pageInfo: {
          hasPreviousPage: false,
          hasNextPage: false,
          startCursor: null,
          endCursor: null,
        },
      })
    )

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query events {
          events {
            pageInfo {
              startCursor
              endCursor
            }
          }
        }
      `,
      data: {
        events: { pageInfo: { startCursor: null, endCursor: null } },
      },
      client,
    })
  })

  describe('forward query arguments to serlo.org', () => {
    test.each([
      ['after', '"10"'],
      ['before', '"10"'],
      ['first', '10'],
      ['last', '10'],
    ])('query parameter = %s', async (filterName, filterValue) => {
      global.server.use(
        createNotificationEventHandler(event1),
        createNotificationEventHandler(event2),
        createEventsHandler(
          {
            eventIds: [2, 1],
            totalCount: 2,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: 1,
              endCursor: 2,
            },
          },
          { [filterName]: '10' }
        )
      )

      await assertSuccessfulGraphQLQuery({
        query: gql`
          query events {
            events(${filterName}: ${filterValue}) {
              totalCount
              nodes {
                ... on AbstractNotificationEvent {
                  __typename
                  id
                  instance
                  date
                }
              }
            }
          }
        `,
        data: {
          events: {
            totalCount: 2,
            nodes: [
              getAbstractNotificationEventDataWithoutSubResolvers(event2),
              getAbstractNotificationEventDataWithoutSubResolvers(event1),
            ],
          },
        },
        client,
      })
    })
  })
})
