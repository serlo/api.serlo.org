/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'

import {
  article,
  getUserDataWithoutSubResolvers,
  user,
  user2,
} from '../../../__fixtures__'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createMessageHandler,
  createTestClient,
  createUuidHandler,
  givenSpreadheetApi,
  givenSpreadsheet,
  hasInternalServerError,
  returnsJson,
  returnsMalformedJson,
} from '../../__utils__'
import { MajorDimension } from '~/model'
import { UuidPayload } from '~/schema/uuid'
import { Instance } from '~/types'

let client: Client

beforeEach(() => {
  client = createTestClient()

  global.server.use(createUuidHandler(user))
})

describe('User', () => {
  test('by alias (/user/profile/:id)', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query user($alias: AliasInput!) {
          uuid(alias: $alias) {
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
      variables: {
        alias: {
          instance: Instance.De,
          path: `/user/profile/${user.id}`,
        },
      },
      data: {
        uuid: getUserDataWithoutSubResolvers(user),
      },
      client,
    })
  })

  test('by alias /user/profile/:id returns null when user does not exist', async () => {
    global.server.use(
      createMessageHandler({
        message: {
          type: 'UuidQuery',
          payload: { id: user.id },
        },
        body: null,
      })
    )

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query user($alias: AliasInput!) {
          uuid(alias: $alias) {
            __typename
          }
        }
      `,
      variables: {
        alias: {
          instance: Instance.De,
          path: `/user/profile/${user.id}`,
        },
      },
      data: { uuid: null },
      client,
    })
  })

  test('by alias /user/profile/:id returns null when uuid :id is no user', async () => {
    global.server.use(createUuidHandler(article))

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query user($alias: AliasInput!) {
          uuid(alias: $alias) {
            __typename
          }
        }
      `,
      variables: {
        alias: {
          instance: Instance.De,
          path: `/user/profile/${article.id}`,
        },
      },
      data: { uuid: null },
      client,
    })
  })

  test('by alias (/:id)', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query user($alias: AliasInput!) {
          uuid(alias: $alias) {
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
      variables: {
        alias: {
          instance: Instance.De,
          path: `/${user.id}`,
        },
      },
      data: {
        uuid: getUserDataWithoutSubResolvers(user),
      },
      client,
    })
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query user($id: Int!) {
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
        uuid: getUserDataWithoutSubResolvers(user),
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
      givenActiveDonors([user])

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
      givenActiveDonors([])

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
        activeAuthors: {
          nodes: [
            getUserDataWithoutSubResolvers(user),
            getUserDataWithoutSubResolvers(user2),
          ],
          totalCount: 2,
        },
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
        activeAuthors: {
          nodes: [getUserDataWithoutSubResolvers(user)],
          totalCount: 1,
        },
      },
      client,
    })
  })

  test('list of active authors is cached', async () => {
    global.server.use(createActiveAuthorsHandler([user]))
    await assertSuccessfulGraphQLQuery({
      query: activeAuthorsQuery,
      data: {
        activeAuthors: {
          nodes: [getUserDataWithoutSubResolvers(user)],
          totalCount: 1,
        },
      },
      client,
    })
    global.server.use(createActiveAuthorsHandler([user, user2]))

    await assertSuccessfulGraphQLQuery({
      query: activeAuthorsQuery,
      data: {
        activeAuthors: {
          nodes: [getUserDataWithoutSubResolvers(user)],
          totalCount: 1,
        },
      },
      client,
    })
  })
})

describe('endpoint activeDonors', () => {
  test('returns list of users', async () => {
    givenActiveDonors([user, user2])
    global.server.use(createUuidHandler(user2))

    await expectActiveUserIds([user.id, user2.id])
  })

  test('returned list only contains user', async () => {
    givenActiveDonors([user, article])
    global.server.use(createUuidHandler(article))

    await expectActiveUserIds([user.id])
  })

  describe('parser', () => {
    test('removes entries which are no valid uuids', async () => {
      givenActiveDonorsSpreadsheet([['Header', '23', 'foo', '-1', '', '1.5']])

      await expectActiveUserIds([23])
    })

    test('cell entries are trimmed of leading and trailing whitespaces', async () => {
      givenActiveDonorsSpreadsheet([['Header', ' 10 ', '  20']])

      await expectActiveUserIds([10, 20])
    })

    describe('returns empty list', () => {
      test('when spreadsheet is empty', async () => {
        givenActiveDonorsSpreadsheet([[]])

        await expectActiveUserIds([])
      })

      test('when spreadsheet api responds with invalid json data', async () => {
        givenSpreadheetApi(returnsJson({}))

        await expectActiveUserIds([])
      })

      test('when spreadsheet api responds with malformed json', async () => {
        givenSpreadheetApi(returnsMalformedJson())

        await expectActiveUserIds([])
      })

      test('when spreadsheet api has an internal server error', async () => {
        givenSpreadheetApi(hasInternalServerError())

        await expectActiveUserIds([])
      })
    })
  })

  function expectActiveUserIds(ids: number[]) {
    global.server.use(...ids.map((id) => createUuidHandler({ ...user, id })))

    return assertSuccessfulGraphQLQuery({
      query: gql`
        query {
          activeDonors {
            nodes {
              __typename
              id
            }
          }
        }
      `,
      data: {
        activeDonors: {
          nodes: ids.map((id) => {
            return { __typename: 'User', id }
          }),
        },
      },
      client,
    })
  }
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
        activeReviewers: {
          nodes: [
            getUserDataWithoutSubResolvers(user),
            getUserDataWithoutSubResolvers(user2),
          ],
          totalCount: 2,
        },
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
        activeReviewers: {
          nodes: [getUserDataWithoutSubResolvers(user)],
          totalCount: 1,
        },
      },
      client,
    })
  })

  test('list of active authors is cached for 1 hour', async () => {
    global.server.use(createActiveReviewersHandler([user]))
    await assertSuccessfulGraphQLQuery({
      query: activeReviewersQuery,
      data: {
        activeReviewers: {
          nodes: [getUserDataWithoutSubResolvers(user)],
          totalCount: 1,
        },
      },
      client,
    })
    global.server.use(createActiveReviewersHandler([user, user2]))

    await assertSuccessfulGraphQLQuery({
      query: activeReviewersQuery,
      data: {
        activeReviewers: {
          nodes: [getUserDataWithoutSubResolvers(user)],
          totalCount: 1,
        },
      },
      client,
    })
  })

  test('uses cached value for active reviewers', async () => {
    await global.cache.set({
      key: 'de.serlo.org/api/user/active-reviewers',
      value: [user.id],
    })

    await assertSuccessfulGraphQLQuery({
      query: activeReviewersQuery,
      data: {
        activeReviewers: {
          nodes: [getUserDataWithoutSubResolvers(user)],
          totalCount: 1,
        },
      },
      client,
    })
  })
})

function createActiveAuthorsHandler(users: UuidPayload[]) {
  return createActiveAuthorsResponseHandler(users.map((user) => user.id))
}

function createActiveAuthorsResponseHandler(body: unknown) {
  return createMessageHandler({
    message: {
      type: 'ActiveAuthorsQuery',
    },
    body,
  })
}

function createActiveReviewersHandler(users: UuidPayload[]) {
  return createActiveReviewersHandlersResponseHandler(
    users.map((user) => user.id)
  )
}

function createActiveReviewersHandlersResponseHandler(body: unknown) {
  return createMessageHandler({
    message: {
      type: 'ActiveReviewersQuery',
    },
    body,
  })
}

function givenActiveDonors(users: UuidPayload[]) {
  const values = [['Header', ...users.map((user) => user.id.toString())]]
  givenActiveDonorsSpreadsheet(values)
}

function givenActiveDonorsSpreadsheet(values: string[][]) {
  givenSpreadsheet({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_API_ACTIVE_DONORS,
    range: 'Tabellenblatt1!A:A',
    majorDimension: MajorDimension.Columns,
    values,
  })
}
