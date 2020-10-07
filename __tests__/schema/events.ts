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
import { option as O } from 'fp-ts'

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
  assertFailingGraphQLQuery,
} from '../__utils__'
import { Cache } from '../../src/graphql/environment'

let client: Client
let cache: Cache

beforeEach(() => {
  ;({ client, cache } = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: user.id,
  }))
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

  test('sets startCursor to first id and endCursor to last id', async () => {
    global.server.use(
      createNotificationEventHandler(event1),
      createNotificationEventHandler(event2),
      createEventsHandler({ eventIds: [2, 1] })
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
        events: { pageInfo: { startCursor: 'Mg==', endCursor: 'MQ==' } },
      },
      client,
    })
  })

  test('forwards results of serlo.org', async () => {
    global.server.use(
      createEventsHandler({
        totalCount: 100,
        pageInfo: { hasNextPage: true, hasPreviousPage: true },
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
          },
        },
      },
      client,
    })
  })

  test('set startCursor and endCursor to null for empty results', async () => {
    global.server.use(createEventsHandler({ eventIds: [] }))

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
      ['after', `"MTA="`],
      ['before', '"MTA="'],
      ['first', '10'],
      ['last', '10'],
      ['userId', '10'],
      ['uuid', '10'],
    ])('query parameter = %s', async (filterName, filterValue) => {
      global.server.use(
        createNotificationEventHandler(event1),
        createNotificationEventHandler(event2),
        createEventsHandler(
          {
            eventIds: [2, 1],
            totalCount: 2,
            pageInfo: { hasNextPage: false, hasPreviousPage: false },
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

  test('cache key works also for query arguments', async () => {
    global.server.use(
      createEventsHandler({ eventIds: [2, 1] }, { first: '10' })
    )

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query events {
          events(first: 10) {
            totalCount
          }
        }
      `,
      data: { events: { totalCount: 2 } },
      client,
    })

    expect(await cache.get('de.serlo.org/api/events?first=10')).toEqual(
      O.some({
        eventIds: [2, 1],
        totalCount: 2,
        pageInfo: { hasPreviousPage: false, hasNextPage: false },
      })
    )
  })

  describe('returns an error when "after" or "before" is not an id.', () => {
    test.each(['after', 'before'])('parameter = %s', async (parameter) => {
      await assertFailingGraphQLQuery({
        message: 'cannot parse "not-a-number" to an id',
        query: gql`
          query events {
            events(${parameter}: "not-a-number") {
              totalCount
            }
          }
        `,
        client,
      })
    })
  })
})
