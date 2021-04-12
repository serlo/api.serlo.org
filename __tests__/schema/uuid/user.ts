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
import { Scope } from '~/authorization'
import { MajorDimension } from '~/model'
import { UuidPayload } from '~/schema/uuid/abstract-uuid/types'
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

  test('property "roles"', async () => {
    global.server.use(
      createUuidHandler({
        ...user,
        roles: ['login', 'en_moderator', 'de_reviewer'],
      })
    )

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query($id: Int) {
          uuid(id: $id) {
            ... on User {
              roles {
                nodes {
                  role
                  scope
                }
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          roles: {
            nodes: [
              { role: 'login', scope: Scope.Serlo },
              { role: 'moderator', scope: Scope.Serlo_En },
              { role: 'reviewer', scope: Scope.Serlo_De },
            ],
          },
        },
      },
      variables: { id: user.id },
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
  test('returns list of active authors', async () => {
    global.server.use(createActiveAuthorsHandler([user, user2]))

    await expectUserIds({ endpoint: 'activeAuthors', ids: [user.id, user2.id] })
  })

  test('returns only users', async () => {
    global.server.use(createActiveAuthorsHandler([user, article]))

    await expectUserIds({ endpoint: 'activeAuthors', ids: [user.id] })
  })
})

describe('endpoint activeReviewers', () => {
  test('returns list of active reviewers', async () => {
    global.server.use(createActiveReviewersHandler([user, user2]))

    await expectUserIds({
      endpoint: 'activeReviewers',
      ids: [user.id, user2.id],
    })
  })

  test('returns only users', async () => {
    global.server.use(createActiveReviewersHandler([user, article]))

    await expectUserIds({ endpoint: 'activeReviewers', ids: [user.id] })
  })
})

describe('endpoint activeDonors', () => {
  test('returns list of users', async () => {
    givenActiveDonors([user, user2])
    global.server.use(createUuidHandler(user2))

    await expectUserIds({ endpoint: 'activeDonors', ids: [user.id, user2.id] })
  })

  test('returned list only contains user', async () => {
    givenActiveDonors([user, article])
    global.server.use(createUuidHandler(article))

    await expectUserIds({ endpoint: 'activeDonors', ids: [user.id] })
  })

  describe('parser', () => {
    test('removes entries which are no valid uuids', async () => {
      givenActiveDonorsSpreadsheet([['Header', '23', 'foo', '-1', '', '1.5']])

      await expectUserIds({ endpoint: 'activeDonors', ids: [23] })
    })

    test('cell entries are trimmed of leading and trailing whitespaces', async () => {
      givenActiveDonorsSpreadsheet([['Header', ' 10 ', '  20']])

      await expectUserIds({ endpoint: 'activeDonors', ids: [10, 20] })
    })

    describe('returns empty list', () => {
      test('when spreadsheet is empty', async () => {
        givenActiveDonorsSpreadsheet([[]])

        await expectUserIds({ endpoint: 'activeDonors', ids: [] })
      })

      test('when spreadsheet api responds with invalid json data', async () => {
        givenSpreadheetApi(returnsJson({}))

        await expectUserIds({ endpoint: 'activeDonors', ids: [] })
      })

      test('when spreadsheet api responds with malformed json', async () => {
        givenSpreadheetApi(returnsMalformedJson())

        await expectUserIds({ endpoint: 'activeDonors', ids: [] })
      })

      test('when spreadsheet api has an internal server error', async () => {
        givenSpreadheetApi(hasInternalServerError())

        await expectUserIds({ endpoint: 'activeDonors', ids: [] })
      })
    })
  })
})

function expectUserIds({
  endpoint,
  ids,
}: {
  endpoint: 'activeReviewers' | 'activeAuthors' | 'activeDonors'
  ids: number[]
}) {
  global.server.use(...ids.map((id) => createUuidHandler({ ...user, id })))

  return assertSuccessfulGraphQLQuery({
    query: gql`
      query {
        ${endpoint} {
          nodes {
            __typename
            id
          }
        }
      }
    `,
    data: {
      [endpoint]: {
        nodes: ids.map((id) => {
          return { __typename: 'User', id }
        }),
      },
    },
    client,
  })
}

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
