import { gql } from 'apollo-server'

import {
  user,
  createEntityNotificationEvent,
  createTaxonomyTermNotificationEvent,
  getAbstractNotificationEventDataWithoutSubResolvers,
} from '../../__fixtures__'
import { NotificationEventPayload } from '../../src/graphql/schema'
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
})
