import { gql } from 'apollo-server'
import * as R from 'ramda'

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
  createEventIdsHandler,
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
      createEventIdsHandler([2, 1])
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
        createEventIdsHandler([2, 1], { [filterName]: '10' })
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
