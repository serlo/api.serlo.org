/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Scope } from '@serlo/authorization'
import { gql } from 'apollo-server'
import R from 'ramda'

import {
  article,
  user,
  user2,
  articleRevision,
  activityByType,
} from '../../../__fixtures__'
import {
  assertErrorEvent,
  assertNoErrorEvents,
  assertSuccessfulGraphQLQuery,
  LegacyClient,
  createChatUsersInfoHandler,
  createMessageHandler,
  createTestClient,
  createUnrevisedEntitiesHandler,
  createUuidHandler,
  getTypenameAndId,
  givenSpreadheetApi,
  givenSpreadsheet,
  hasInternalServerError,
  nextUuid,
  returnsJson,
  returnsMalformedJson,
  given,
  Client,
  givenUuid,
} from '../../__utils__'
import { Model } from '~/internals/graphql'
import { MajorDimension } from '~/model'
import { castToUuid } from '~/model/decoder'
import { Instance } from '~/types'

let legacyClient: LegacyClient

beforeEach(() => {
  legacyClient = createTestClient()

  givenUuid(user)
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
        uuid: R.pick(
          [
            '__typename',
            'id',
            'trashed',
            'username',
            'date',
            'lastLogin',
            'description',
          ],
          user
        ),
      },
      client: legacyClient,
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
      client: legacyClient,
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
      client: legacyClient,
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
        uuid: getTypenameAndId(user),
      },
      client: legacyClient,
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
            }
          }
        }
      `,
      variables: user,
      data: { uuid: getTypenameAndId(user) },
      client: legacyClient,
    })
  })

  test('property "imageUrl"', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query user($id: Int!) {
          uuid(id: $id) {
            ... on User {
              imageUrl
            }
          }
        }
      `,
      variables: user,
      data: {
        uuid: { imageUrl: 'https://community.serlo.org/avatar/alpha' },
      },
      client: legacyClient,
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
        query ($id: Int) {
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
      client: legacyClient,
    })
  })

  test('property "isNewAuthor"', async () => {
    given('ActivityByTypeQuery')
      .withPayload({ userId: user.id })
      .returns(activityByType)

    await new Client()
      .prepareQuery({
        query: gql`
          query ($userId: Int) {
            uuid(id: $userId) {
              ... on User {
                isNewAuthor
              }
            }
          }
        `,
        variables: { userId: user.id },
      })
      .shouldReturnData({ uuid: { isNewAuthor: false } })
  })

  test('property "activityByType"', async () => {
    given('ActivityByTypeQuery')
      .withPayload({ userId: user.id })
      .returns(activityByType)

    await new Client()
      .prepareQuery({
        query: gql`
          query ($userId: Int) {
            uuid(id: $userId) {
              ... on User {
                activityByType {
                  edits
                  comments
                  reviews
                  taxonomy
                }
              }
            }
          }
        `,
        variables: { userId: user.id },
      })
      .shouldReturnData({ uuid: { activityByType } })
  })

  describe('property "activeAuthor"', () => {
    const query = new Client().prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on User {
              isActiveAuthor
            }
          }
        }
      `,
      variables: { id: user.id },
    })

    test('by id (w/ activeAuthor when user is an active author)', async () => {
      given('ActiveAuthorsQuery').returns([user.id])

      await query.shouldReturnData({ uuid: { isActiveAuthor: true } })
    })

    test('by id (w/ activeAuthor when user is not an active author', async () => {
      given('ActiveAuthorsQuery').returns([])

      await query.shouldReturnData({ uuid: { isActiveAuthor: false } })
    })
  })

  describe('property "activeDonor"', () => {
    const query = gql`
      query ($id: Int!) {
        uuid(id: $id) {
          ... on User {
            isActiveDonor
          }
        }
      }
    `

    test('by id (w/ activeDonor when user is an active donor)', async () => {
      givenActiveDonors([user])

      await assertSuccessfulGraphQLQuery({
        query,
        variables: { id: user.id },
        data: { uuid: { isActiveDonor: true } },
        client: legacyClient,
      })
    })

    test('by id (w/ activeDonor when user is not an active donor', async () => {
      givenActiveDonors([])

      await assertSuccessfulGraphQLQuery({
        query,
        variables: { id: user.id },
        data: { uuid: { isActiveDonor: false } },
        client: legacyClient,
      })
    })
  })

  describe('property "activeReviewer"', () => {
    const query = new Client().prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on User {
              isActiveReviewer
            }
          }
        }
      `,
      variables: { id: user.id },
    })

    test('by id (w/ activeReviewer when user is an active reviewer)', async () => {
      given('ActiveReviewersQuery').returns([user.id])

      await query.shouldReturnData({ uuid: { isActiveReviewer: true } })
    })

    test('by id (w/ activeReviewer when user is not an active reviewer', async () => {
      given('ActiveReviewersQuery').returns([])

      await query.shouldReturnData({ uuid: { isActiveReviewer: false } })
    })
  })

  describe('property "motivation"', () => {
    beforeEach(() => {
      givenMotivationsSpreadsheet([
        ['Motivation', 'Username', 'Can be published?'],
        ['Serlo is gre', 'foo', 'yes'],
        ['Serlo is great!', 'foo', 'yes'],
        ['Serlo is awesome!', 'bar', 'no'],
      ])
    })

    test('returns last approved motivation of motivation spreadsheet', async () => {
      await assertSuccessfulMotivationQuery({
        username: 'foo',
        motivation: 'Serlo is great!',
      })
    })

    test('returns null when motivation was not reviewed', async () => {
      await assertSuccessfulMotivationQuery({
        username: 'bar',
        motivation: null,
      })
    })

    test('can handle empty cells in a row (which are not returned by the Spreadsheet API)', async () => {
      // See also https://sentry.io/organizations/serlo/issues/2511560095/events/3f43e678ba524ffa8014811c8e116f78/
      givenMotivationsSpreadsheet([
        ['Motivation', 'Username', 'Can be published?'],
        ['Serlo is awesome!', 'bar', 'no'],
        ['Serlo is awesome!', 'bar'],
        ['Serlo is awesome!'],
        [],
      ])

      await assertSuccessfulMotivationQuery({
        username: 'bar',
        motivation: null,
      })

      await assertNoErrorEvents()
    })

    test('returns null when user is not in spreadsheet with motivations', async () => {
      await assertSuccessfulMotivationQuery({
        username: 'war',
        motivation: null,
      })
    })

    test('returns null when there is an error in the google spreadsheet api + report to sentry', async () => {
      givenSpreadheetApi(hasInternalServerError())

      await assertSuccessfulMotivationQuery({ motivation: null })
      await assertErrorEvent({ location: 'motivationSpreadsheet' })
    })

    async function assertSuccessfulMotivationQuery({
      motivation,
      username = 'foo',
    }: {
      motivation: string | null
      username?: string
    }) {
      global.server.use(createUuidHandler({ ...user, username }))

      await assertSuccessfulGraphQLQuery({
        query: gql`
          query ($id: Int!) {
            uuid(id: $id) {
              ... on User {
                motivation
              }
            }
          }
        `,
        variables: { id: user.id },
        data: { uuid: { motivation } },
        client: legacyClient,
      })
    }
  })

  describe('property "chatUrl"', () => {
    test('when user is registered at community.serlo.org', async () => {
      global.server.use(
        createChatUsersInfoHandler({ username: user.username, success: true })
      )

      await assertSuccessfulGraphQLQuery({
        query: gql`
          query user($id: Int!) {
            uuid(id: $id) {
              ... on User {
                chatUrl
              }
            }
          }
        `,
        variables: user,
        data: { uuid: { chatUrl: 'https://community.serlo.org/direct/alpha' } },
        client: legacyClient,
      })
    })

    test('when user is registered at community.serlo.org', async () => {
      global.server.use(
        createChatUsersInfoHandler({ username: user.username, success: false })
      )

      await assertSuccessfulGraphQLQuery({
        query: gql`
          query user($id: Int!) {
            uuid(id: $id) {
              ... on User {
                chatUrl
              }
            }
          }
        `,
        variables: user,
        data: { uuid: { chatUrl: null } },
        client: legacyClient,
      })
    })
  })

  test('property unrevisedEntities', async () => {
    const unrevisedRevisionByUser: Model<'ArticleRevision'> = {
      ...articleRevision,
      id: nextUuid(article.currentRevisionId!),
      authorId: user.id,
    }
    const unrevisedRevisionByAnotherUser: Model<'ArticleRevision'> = {
      ...articleRevision,
      id: nextUuid(unrevisedRevisionByUser.id),
      authorId: user2.id,
    }
    const articleByUser: Model<'Article'> = {
      ...article,
      id: nextUuid(article.id),
      revisionIds: [unrevisedRevisionByUser.id, ...article.revisionIds],
    }
    const articleByAnotherUser: Model<'Article'> = {
      ...article,
      id: nextUuid(articleByUser.id),
      revisionIds: [unrevisedRevisionByAnotherUser.id, ...article.revisionIds],
    }

    global.server.use(
      createUnrevisedEntitiesHandler([articleByUser, articleByAnotherUser]),
      createUuidHandler(unrevisedRevisionByUser),
      createUuidHandler(unrevisedRevisionByAnotherUser),
      createUuidHandler(articleByAnotherUser),
      createUuidHandler(articleByUser)
    )

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query user($id: Int!) {
          uuid(id: $id) {
            ... on User {
              unrevisedEntities {
                nodes {
                  id
                  __typename
                }
              }
            }
          }
        }
      `,
      variables: { id: user.id },
      data: {
        uuid: {
          unrevisedEntities: { nodes: [getTypenameAndId(articleByUser)] },
        },
      },
      client: legacyClient,
    })
  })
})

describe('endpoint activeAuthors', () => {
  test('returns list of active authors', async () => {
    given('ActiveAuthorsQuery').returns([user.id, user2.id])

    await expectUserIds({ endpoint: 'activeAuthors', ids: [user.id, user2.id] })
  })

  test('returns only users', async () => {
    given('ActiveAuthorsQuery').returns([user.id, article.id])
    givenUuid(article)

    await expectUserIds({ endpoint: 'activeAuthors', ids: [user.id] })
    await assertErrorEvent({ errorContext: { invalidElements: [article] } })
  })
})

describe('endpoint activeReviewers', () => {
  test('returns list of active reviewers', async () => {
    given('ActiveReviewersQuery').returns([user.id, user2.id])

    await expectUserIds({
      endpoint: 'activeReviewers',
      ids: [user.id, user2.id],
    })
  })

  test('returns only users', async () => {
    given('ActiveReviewersQuery').returns([user.id, article.id])
    givenUuid(article)

    await expectUserIds({ endpoint: 'activeReviewers', ids: [user.id] })
    await assertErrorEvent({ errorContext: { invalidElements: [article] } })
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
    await assertErrorEvent({ errorContext: { invalidElements: [article] } })
  })

  describe('parser', () => {
    test('removes entries which are no valid uuids', async () => {
      givenActiveDonorsSpreadsheet([['Header', '23', 'foo', '-1', '', '1.5']])

      await expectUserIds({ endpoint: 'activeDonors', ids: [23] })
      await assertErrorEvent({
        message: 'invalid entry in activeDonorSpreadsheet',
        errorContext: { invalidElements: ['foo', '-1', '', '1.5'] },
      })
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
        givenSpreadheetApi(returnsJson({ json: {} }))

        await expectUserIds({ endpoint: 'activeDonors', ids: [] })
        await assertErrorEvent()
      })

      test('when spreadsheet api responds with malformed json', async () => {
        givenSpreadheetApi(returnsMalformedJson())

        await expectUserIds({ endpoint: 'activeDonors', ids: [] })
        await assertErrorEvent()
      })

      test('when spreadsheet api has an internal server error', async () => {
        givenSpreadheetApi(hasInternalServerError())

        await expectUserIds({ endpoint: 'activeDonors', ids: [] })
        await assertErrorEvent()
      })
    })
  })
})

async function expectUserIds({
  endpoint,
  ids,
}: {
  endpoint: 'activeReviewers' | 'activeAuthors' | 'activeDonors'
  ids: number[]
}) {
  ids.map(castToUuid).forEach((id) => givenUuid({ ...user, id }))
  const nodes = ids.map((id) => {
    return { __typename: 'User', id }
  })

  await new Client()
    .prepareQuery({
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
    })
    .shouldReturnData({ [endpoint]: { nodes } })
}

function givenActiveDonors(users: Model<'AbstractUuid'>[]) {
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

function givenMotivationsSpreadsheet(values: string[][]) {
  givenSpreadsheet({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_API_MOTIVATION,
    range: 'Formularantworten!B:D',
    majorDimension: MajorDimension.Rows,
    values,
  })
}
