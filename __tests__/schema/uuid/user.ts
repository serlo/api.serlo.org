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
import { rest } from 'msw'

import { article, user, user2 } from '../../../__fixtures__'
import { Cache } from '../../../src/graphql/environment'
import { Service } from '../../../src/graphql/schema/types'
import { UuidPayload } from '../../../src/graphql/schema/uuid/abstract-uuid'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createTestClient,
  createUuidHandler,
  createJsonHandler,
} from '../../__utils__'

let client: Client
let cache: Cache

beforeEach(() => {
  ;({ client, cache } = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: null,
  }))

  global.server.use(createUuidHandler(user))
})

describe('User', () => {
  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query article($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on User {
              id
              trashed
              username
              date
              lastLogin
              description
            }
          }
        }
      `,
      variables: user,
      data: {
        uuid: user,
      },
      client,
    })
  })

  describe('property "activeAuthor"', () => {
    const query = gql`
      query propertyActiveAuthor($id: Int!) {
        uuid(id: $id) {
          ... on User {
            activeAuthor
          }
        }
      }
    `

    test('by id (w/ activeAuthor when user is an active author)', async () => {
      global.server.use(createActiveAuthorsHandler([user]))

      await assertSuccessfulGraphQLQuery({
        query,
        variables: { id: user.id },
        data: {
          uuid: { activeAuthor: true },
        },
        client,
      })
    })

    test('by id (w/ activeAuthor when user is not an active author', async () => {
      global.server.use(createActiveAuthorsHandler([]))

      await assertSuccessfulGraphQLQuery({
        query,
        variables: { id: user.id },
        data: {
          uuid: { activeAuthor: false },
        },
        client,
      })
    })
  })

  describe('property "activeDonor"', () => {
    const query = gql`
      query propertyActiveDonor($id: Int!) {
        uuid(id: $id) {
          ... on User {
            activeDonor
          }
        }
      }
    `

    test('by id (w/ activeDonor when user is an active donor)', async () => {
      global.server.use(createActiveDonorsHandler([user]))

      await assertSuccessfulGraphQLQuery({
        query,
        variables: { id: user.id },
        data: {
          uuid: { activeDonor: true },
        },
        client,
      })
    })

    test('by id (w/ activeDonor when user is not an active donor', async () => {
      global.server.use(createActiveDonorsHandler([]))

      await assertSuccessfulGraphQLQuery({
        query,
        variables: { id: user.id },
        data: {
          uuid: { activeDonor: false },
        },
        client,
      })
    })
  })

  describe('property "activeReviewer"', () => {
    const query = gql`
      query propertyActiveReviewer($id: Int!) {
        uuid(id: $id) {
          ... on User {
            activeReviewer
          }
        }
      }
    `

    test('by id (w/ activeReviewer when user is an active reviewer)', async () => {
      global.server.use(createActiveReviewersHandler([user]))

      await assertSuccessfulGraphQLQuery({
        query,
        variables: { id: user.id },
        data: {
          uuid: { activeReviewer: true },
        },
        client,
      })
    })

    test('by id (w/ activeReviewer when user is not an active reviewer', async () => {
      global.server.use(createActiveReviewersHandler([]))

      await assertSuccessfulGraphQLQuery({
        query,
        variables: { id: user.id },
        data: {
          uuid: { activeReviewer: false },
        },
        client,
      })
    })
  })
})

describe('endpoint activeAuthors', () => {
  const activeAuthorsQuery = gql`
    {
      activeAuthors {
        nodes {
          __typename
          id
          trashed
          username
          date
          lastLogin
          description
        }
        totalCount
      }
    }
  `

  test('returns list of active authors', async () => {
    global.server.use(
      createUuidHandler(user2),
      createActiveAuthorsHandler([user, user2])
    )

    await assertSuccessfulGraphQLQuery({
      query: activeAuthorsQuery,
      data: {
        activeAuthors: { nodes: [user, user2], totalCount: 2 },
      },
      client,
    })
  })

  test('returned list does only contain users', async () => {
    global.server.use(
      createUuidHandler(article),
      createActiveAuthorsHandler([user, article])
    )

    await assertSuccessfulGraphQLQuery({
      query: activeAuthorsQuery,
      data: {
        activeAuthors: { nodes: [user], totalCount: 1 },
      },
      client,
    })
  })

  test('list of active authors is cached for 1 hour', async () => {
    global.server.use(createActiveAuthorsHandler([user]))

    await assertSuccessfulGraphQLQuery({
      query: activeAuthorsQuery,
      data: {
        activeAuthors: { nodes: [user], totalCount: 1 },
      },
      client,
    })

    expect(await cache.get('de.serlo.org/api/user/active-authors')).toEqual(
      O.some([user.id])
    )
    expect(await cache.getTtl('de.serlo.org/api/user/active-authors')).toEqual(
      O.some(60 * 60 * 24)
    )
  })

  test('uses cached value for active authors', async () => {
    await cache.set('de.serlo.org/api/user/active-authors', [user.id])

    await assertSuccessfulGraphQLQuery({
      query: activeAuthorsQuery,
      data: {
        activeAuthors: { nodes: [user], totalCount: 1 },
      },
      client,
    })
  })
})

describe('endpoint activeDonors', () => {
  const activeDonorsQuery = gql`
    {
      activeDonors {
        nodes {
          __typename
          id
          trashed
          username
          date
          lastLogin
          description
        }
        totalCount
      }
    }
  `

  test('returns list of users', async () => {
    global.server.use(
      createUuidHandler(user2),
      createActiveDonorsHandler([user, user2])
    )
    await assertSuccessfulGraphQLQuery({
      query: activeDonorsQuery,
      data: {
        activeDonors: { nodes: [user, user2], totalCount: 2 },
      },
      client,
    })
  })

  test('returned list only contains user', async () => {
    global.server.use(
      createUuidHandler(article),
      createActiveDonorsHandler([user, article])
    )
    await assertSuccessfulGraphQLQuery({
      query: activeDonorsQuery,
      data: {
        activeDonors: { nodes: [user], totalCount: 1 },
      },
      client,
    })
  })

  describe('parser', () => {
    function createActiveDonorsQueryExpectingIds(ids: number[]) {
      return {
        query: gql`
          {
            activeDonors {
              nodes {
                id
              }
            }
          }
        `,
        data: {
          activeDonors: {
            nodes: ids.map((id) => {
              return { id }
            }),
          },
        },
      }
    }

    function createUsersHandler(ids: number[]) {
      return ids.map((id) => {
        return createUuidHandler({ ...user, id })
      })
    }

    test('extract user ids from first column with omitting the header', async () => {
      global.server.use(
        ...createUsersHandler([1, 2, 3]),
        createActiveDonorsSpreadsheetHandler([['Header', '1', '2', '3']])
      )
      await assertSuccessfulGraphQLQuery({
        ...createActiveDonorsQueryExpectingIds([1, 2, 3]),
        client,
      })
    })

    test('removes entries which are no valid uuids', async () => {
      global.server.use(
        ...createUsersHandler([23]),
        createActiveDonorsSpreadsheetHandler([
          ['Header', '23', 'foo', '-1', '', '1.5'],
        ])
      )
      await assertSuccessfulGraphQLQuery({
        ...createActiveDonorsQueryExpectingIds([23]),
        client,
      })
    })

    test('cell entries are trimmed of leading and trailing whitespaces', async () => {
      global.server.use(
        ...createUsersHandler([10, 20]),
        createActiveDonorsSpreadsheetHandler([['Header', ' 10 ', '  20']])
      )
      await assertSuccessfulGraphQLQuery({
        ...createActiveDonorsQueryExpectingIds([10, 20]),
        client,
      })
    })

    test('returns empty list when spreadsheet is empty', async () => {
      global.server.use(createActiveDonorsSpreadsheetHandler([[]]))
      await assertSuccessfulGraphQLQuery({
        ...createActiveDonorsQueryExpectingIds([]),
        client,
      })
    })

    test('returns empty list when an error occured while accessing the spreadsheet', async () => {
      global.server.use(createActiveDonorsSpreadsheetResponseHandler({}))
      await assertSuccessfulGraphQLQuery({
        ...createActiveDonorsQueryExpectingIds([]),
        client,
      })
    })
  })
})

describe('endpoint activeReviewers', () => {
  const activeReviewersQuery = gql`
    {
      activeReviewers {
        nodes {
          __typename
          id
          trashed
          username
          date
          lastLogin
          description
        }
        totalCount
      }
    }
  `

  test('returns list of active reviewers', async () => {
    global.server.use(
      createUuidHandler(user2),
      createActiveReviewersHandler([user, user2])
    )

    await assertSuccessfulGraphQLQuery({
      query: activeReviewersQuery,
      data: {
        activeReviewers: { nodes: [user, user2], totalCount: 2 },
      },
      client,
    })
  })

  test('returned list does only contain users', async () => {
    global.server.use(
      createUuidHandler(article),
      createActiveReviewersHandler([user, article])
    )

    await assertSuccessfulGraphQLQuery({
      query: activeReviewersQuery,
      data: {
        activeReviewers: { nodes: [user], totalCount: 1 },
      },
      client,
    })
  })

  test('list of active authors is cached for 1 hour', async () => {
    global.server.use(createActiveReviewersHandler([user]))

    await assertSuccessfulGraphQLQuery({
      query: activeReviewersQuery,
      data: {
        activeReviewers: { nodes: [user], totalCount: 1 },
      },
      client,
    })

    expect(await cache.get('de.serlo.org/api/user/active-reviewers')).toEqual(
      O.some([user.id])
    )
    expect(
      await cache.getTtl('de.serlo.org/api/user/active-reviewers')
    ).toEqual(O.some(60 * 60 * 24))
  })

  test('uses cached value for active reviewers', async () => {
    await cache.set('de.serlo.org/api/user/active-reviewers', [user.id])

    await assertSuccessfulGraphQLQuery({
      query: activeReviewersQuery,
      data: {
        activeReviewers: { nodes: [user], totalCount: 1 },
      },
      client,
    })
  })
})

function createActiveAuthorsHandler(users: UuidPayload[]) {
  return createActiveAuthorsResponseHandler(users.map((user) => user.id))
}

function createActiveAuthorsResponseHandler(body: unknown) {
  return createJsonHandler({ path: '/api/user/active-authors', body })
}

function createActiveReviewersHandler(users: UuidPayload[]) {
  return createActiveReviewersHandlersResponseHandler(
    users.map((user) => user.id)
  )
}

function createActiveReviewersHandlersResponseHandler(body: unknown) {
  return createJsonHandler({ path: '/api/user/active-reviewers', body })
}

function createActiveDonorsHandler(users: UuidPayload[]) {
  return createActiveDonorsSpreadsheetHandler([
    ['Header', ...users.map((user) => user.id.toString())],
  ])
}

function createActiveDonorsSpreadsheetHandler(values: string[][]) {
  const body = {
    range: 'Tabellenblatt1!A:A',
    majorDimension: 'COLUMNS',
    values,
  }
  return createActiveDonorsSpreadsheetResponseHandler(body)
}

function createActiveDonorsSpreadsheetResponseHandler(
  body: Record<string, unknown>
) {
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/` +
    `${process.env.ACTIVE_DONORS_SPREADSHEET_ID}/values/Tabellenblatt1!A:A` +
    `?majorDimension=COLUMNS&key=${process.env.GOOGLE_API_KEY}`
  return rest.get(url, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(body))
  })
}
