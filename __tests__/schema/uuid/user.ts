import { Scope } from '@serlo/authorization'
import gql from 'graphql-tag'
import * as R from 'ramda'

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
  createChatUsersInfoHandler,
  getTypenameAndId,
  givenSpreadheetApi,
  givenSpreadsheet,
  hasInternalServerError,
  nextUuid,
  given,
  Client,
} from '../../__utils__'
import { Model } from '~/internals/graphql'
import { MajorDimension } from '~/model'
import { Instance } from '~/types'

const client = new Client()

beforeEach(() => {
  given('UuidQuery').for(user)
})

describe('User', () => {
  test('by alias (/user/profile/:id)', async () => {
    await client
      .prepareQuery({
        query: gql`
          query user($alias: AliasInput!) {
            uuid(alias: $alias) {
              __typename
              ... on User {
                id
                trashed
                username
                date
                description
              }
            }
          }
        `,
      })
      .withVariables({
        alias: {
          instance: Instance.De,
          path: `/user/profile/${user.id}`,
        },
      })
      .shouldReturnData({
        uuid: R.pick(
          ['__typename', 'id', 'trashed', 'username', 'date', 'description'],
          user,
        ),
      })
  })

  test('by alias /user/profile/:id returns null when user does not exist', async () => {
    given('UuidQuery').withPayload({ id: user.id }).returnsNotFound()

    await client
      .prepareQuery({
        query: gql`
          query user($alias: AliasInput!) {
            uuid(alias: $alias) {
              __typename
            }
          }
        `,
      })
      .withVariables({
        alias: {
          instance: Instance.De,
          path: `/user/profile/${user.id}`,
        },
      })
      .shouldReturnData({ uuid: null })
  })

  test('by alias /user/profile/:id returns null when uuid :id is no user', async () => {
    given('UuidQuery').for(article)

    await client
      .prepareQuery({
        query: gql`
          query user($alias: AliasInput!) {
            uuid(alias: $alias) {
              __typename
            }
          }
        `,
      })
      .withVariables({
        alias: {
          instance: Instance.De,
          path: `/user/profile/${article.id}`,
        },
      })
      .shouldReturnData({ uuid: null })
  })

  test('by alias (/:id)', async () => {
    await client
      .prepareQuery({
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
      })
      .withVariables({
        alias: {
          instance: Instance.De,
          path: `/${user.id}`,
        },
      })
      .shouldReturnData({
        uuid: getTypenameAndId(user),
      })
  })

  test('by id', async () => {
    await client
      .prepareQuery({
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
      })
      .withVariables(user)
      .shouldReturnData({ uuid: getTypenameAndId(user) })
  })

  test('property "imageUrl"', async () => {
    await client
      .prepareQuery({
        query: gql`
          query user($id: Int!) {
            uuid(id: $id) {
              ... on User {
                imageUrl
              }
            }
          }
        `,
      })
      .withVariables(user)
      .shouldReturnData({
        uuid: { imageUrl: 'https://community.serlo.org/avatar/admin' },
      })
  })

  test('property "roles"', async () => {
    given('UuidQuery').for({
      ...user,
      roles: ['login', 'en_moderator', 'de_reviewer'],
    })

    await client
      .prepareQuery({
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
      })
      .withVariables({ id: user.id })
      .shouldReturnData({
        uuid: {
          roles: {
            nodes: [
              { role: 'login', scope: Scope.Serlo },
              { role: 'moderator', scope: Scope.Serlo_En },
              { role: 'reviewer', scope: Scope.Serlo_De },
            ],
          },
        },
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
      })
      .withVariables({ userId: user.id })
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
      })
      .withVariables({ userId: user.id })
      .shouldReturnData({ uuid: { activityByType } })
  })

  describe('property "activeAuthor"', () => {
    const query = new Client()
      .prepareQuery({
        query: gql`
          query ($id: Int!) {
            uuid(id: $id) {
              ... on User {
                isActiveAuthor
              }
            }
          }
        `,
      })
      .withVariables({ id: user.id })

    test('by id (w/ activeAuthor when user is an active author)', async () => {
      timer.setCurrentDate(new Date('2014-04-16T14:48:29'))

      await query.shouldReturnData({ uuid: { isActiveAuthor: true } })
    })

    test('by id (w/ activeAuthor when user is not an active author', async () => {
      await query
        .withVariables({ id: user2.id })
        .shouldReturnData({ uuid: { isActiveAuthor: false } })
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

      await client
        .prepareQuery({ query })
        .withVariables({ id: user.id })
        .shouldReturnData({ uuid: { isActiveDonor: true } })
    })

    test('by id (w/ activeDonor when user is not an active donor', async () => {
      givenActiveDonors([])

      await client
        .prepareQuery({ query })
        .withVariables({ id: user.id })
        .shouldReturnData({ uuid: { isActiveDonor: false } })
    })
  })

  describe('property "activeReviewer"', () => {
    const query = new Client()
      .prepareQuery({
        query: gql`
          query ($id: Int!) {
            uuid(id: $id) {
              ... on User {
                isActiveReviewer
              }
            }
          }
        `,
      })
      .withVariables({ id: user.id })

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
      given('UuidQuery').for({ ...user, username })

      await client
        .prepareQuery({
          query: gql`
            query ($id: Int!) {
              uuid(id: $id) {
                ... on User {
                  motivation
                }
              }
            }
          `,
        })
        .withVariables({ id: user.id })
        .shouldReturnData({ uuid: { motivation } })
    }
  })

  describe('property "chatUrl"', () => {
    test('when user is registered at community.serlo.org', async () => {
      global.server.use(
        createChatUsersInfoHandler({ username: user.username, success: true }),
      )

      await client
        .prepareQuery({
          query: gql`
            query user($id: Int!) {
              uuid(id: $id) {
                ... on User {
                  chatUrl
                }
              }
            }
          `,
        })
        .withVariables(user)
        .shouldReturnData({
          uuid: { chatUrl: 'https://community.serlo.org/direct/admin' },
        })
    })

    test('when user is registered at community.serlo.org', async () => {
      global.server.use(
        createChatUsersInfoHandler({ username: user.username, success: false }),
      )

      await client
        .prepareQuery({
          query: gql`
            query user($id: Int!) {
              uuid(id: $id) {
                ... on User {
                  chatUrl
                }
              }
            }
          `,
        })
        .withVariables(user)
        .shouldReturnData({ uuid: { chatUrl: null } })
    })
  })

  test('property unrevisedEntities', async () => {
    await client
      .prepareQuery({
        query: gql`
          query user($id: Int!) {
            uuid(id: $id) {
              ... on User {
                unrevisedEntities {
                  nodes {
                    id
                  }
                }
              }
            }
          }
        `,
        variables: { id: 299 },
      })
      .shouldReturnData({
        uuid: {
          unrevisedEntities: { nodes: [{ id: 26892 }] },
        },
      })
  })

  describe('property lastLogin', () => {
    const query = client
      .prepareQuery({
        query: gql`
          query user($id: Int!) {
            uuid(id: $id) {
              ... on User {
                lastLogin
              }
            }
          }
        `,
      })
      .withVariables({
        id: user.id,
      })
    test('returns null for unauthenticated user', async () => {
      await query.shouldReturnData({
        uuid: {
          lastLogin: null,
        },
      })
    })
    test('is readable for authenticated user', async () => {
      await query.forLoginUser().shouldReturnData({
        uuid: {
          lastLogin: user.lastLogin,
        },
      })
    })
  })
})

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
