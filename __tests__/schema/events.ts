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
  createCurrentEventIdHandler,
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
  test('returns list of current events', async () => {
    const event1 = { ...createEntityNotificationEvent, id: 1 }
    const event2 = { ...createTaxonomyTermNotificationEvent, id: 2 }
    global.server.use(
      createNotificationEventHandler(event1),
      createNotificationEventHandler(event2),
      createCurrentEventIdHandler(2)
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

  test('argument "first" is maximal 100', async () => {
    const ids = R.range(101, 201).reverse()

    ids.forEach((id) =>
      global.server.use(
        createNotificationEventHandler({ ...createEntityNotificationEvent, id })
      )
    )
    global.server.use(createCurrentEventIdHandler(200))

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query events {
          events(first: 150) {
            totalCount
            nodes {
              ... on AbstractNotificationEvent {
                id
              }
            }
          }
        }
      `,
      data: {
        events: {
          totalCount: 200,
          nodes: ids.map((id) => {
            return { id }
          }),
        },
      },
      client,
    })
  })

  test('argument "last" is maximal 100', async () => {
    const ids = R.range(1, 101).reverse()

    ids.forEach((id) =>
      global.server.use(
        createNotificationEventHandler({ ...createEntityNotificationEvent, id })
      )
    )
    global.server.use(createCurrentEventIdHandler(200))

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query events {
          events(last: 150) {
            totalCount
            nodes {
              ... on AbstractNotificationEvent {
                id
              }
            }
          }
        }
      `,
      data: {
        events: {
          totalCount: 200,
          nodes: ids.map((id) => {
            return { id }
          }),
        },
      },
      client,
    })
  })

  test('maximal 100 events are returned', async () => {
    const ids = R.range(101, 201).reverse()

    ids.forEach((id) =>
      global.server.use(
        createNotificationEventHandler({ ...createEntityNotificationEvent, id })
      )
    )
    global.server.use(createCurrentEventIdHandler(200))

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query events {
          events {
            totalCount
            nodes {
              ... on AbstractNotificationEvent {
                id
              }
            }
          }
        }
      `,
      data: {
        events: {
          totalCount: 200,
          nodes: ids.map((id) => {
            return { id }
          }),
        },
      },
      client,
    })
  })
})
