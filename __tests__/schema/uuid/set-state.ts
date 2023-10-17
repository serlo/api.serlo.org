import gql from 'graphql-tag'

import {
  article,
  page,
  pageRevision,
  taxonomyTermRoot,
  user2,
  user as baseUser,
} from '../../../__fixtures__'
import { Client, given } from '../../__utils__'

const uuids = [article, page, pageRevision, taxonomyTermRoot, user2]
const client = new Client({ userId: baseUser.id })
const mutation = client.prepareQuery({
  query: gql`
    mutation uuid($input: UuidSetStateInput!) {
      uuid {
        setState(input: $input) {
          success
        }
      }
    }
  `,
})

beforeEach(() => {
  given('UuidQuery').for(page, pageRevision, taxonomyTermRoot, user2, article)

  given('UuidSetStateMutation')
    .withPayload({ userId: baseUser.id, trashed: true })
    .isDefinedBy((req, res, ctx) => {
      const { ids, trashed } = req.body.payload

      for (const id of ids) {
        const article = uuids.find((x) => x.id === id)

        if (article != null) {
          article.trashed = trashed
        } else {
          return res(ctx.status(500))
        }
      }

      return res(ctx.status(200))
    })
})
describe('infrastructural testing', () => {
  beforeEach(() => {
    given('UuidQuery').for({ ...baseUser, roles: ['de_architect'] })
  })

  test('returns "{ success: true }" when it succeeds', async () => {
    await mutation
      .withInput({ id: [article.id], trashed: true })
      .shouldReturnData({ uuid: { setState: { success: true } } })
  })

  test('updates the cache when it succeeds', async () => {
    const uuidQuery = client
      .prepareQuery({
        query: gql`
          query ($id: Int!) {
            uuid(id: $id) {
              trashed
            }
          }
        `,
      })
      .withVariables({ id: article.id })

    await uuidQuery.shouldReturnData({ uuid: { trashed: true } })
    await mutation.withInput({ id: [article.id], trashed: true }).execute()

    await uuidQuery.shouldReturnData({ uuid: { trashed: true } })
  })

  test('fails when database layer returns a BadRequest response', async () => {
    given('UuidSetStateMutation').returnsBadRequest()

    await mutation
      .withInput({ id: [article.id], trashed: true })
      .shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal server error', async () => {
    given('UuidSetStateMutation').hasInternalServerError()

    await mutation
      .withInput({ id: [article.id], trashed: true })
      .shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

describe('permission-based testing', () => {
  test('fails when user is not authenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .withInput({ id: [article.id], trashed: true })
      .shouldFailWithError('UNAUTHENTICATED')
  })

  // TESTS TO BUILD:
  // role: login
  // uuids negative response: page, pageRevision, user2, taxonomyTermRoot, article

  // role: de_architect
  // uuids positive response: taxonomyTermRoot, article
  // uuids negative response: page, pageRevision, user2

  // role: (de_)static_pages_builder
  // uuids positive response: page, pageRevision
  // uuids negative response: taxonomyTermRoot, user2, article

  test('fails when login user tries to set state of page', async () => {
    given('UuidQuery').for({ ...baseUser, roles: ['login'] }, page)

    await mutation
      .withInput({ id: [page.id], trashed: true })
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when login user tries to set state of page revision', async () => {
    given('UuidQuery').for({ ...baseUser, roles: ['login'] }, pageRevision)

    await mutation
      .withInput({ id: [pageRevision.id], trashed: true })
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when architect tries to set state of page', async () => {
    given('UuidQuery').for({ ...baseUser, roles: ['de_architect'] }, page)

    await mutation
      .withInput({ id: [page.id], trashed: false })
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when architect tries to set state of user', async () => {
    given('UuidQuery').for({ ...baseUser, roles: ['de_architect'] }, user2)

    await mutation
      .withInput({ id: [user2.id], trashed: false })
      .shouldFailWithError('FORBIDDEN')
  })

  test('returns "{ success: true }" when architect tries to set state of article', async () => {
    given('UuidQuery').for({ ...baseUser, roles: ['de_architect'] }, article)

    await mutation
      .withInput({ id: [article.id], trashed: true })
      .shouldReturnData({ uuid: { setState: { success: true } } })
  })

  test('returns "{ success: true }" when architect tries to set state of taxonomy term', async () => {
    given('UuidQuery').for(
      { ...baseUser, roles: ['de_architect'] },
      taxonomyTermRoot,
    )

    await mutation
      .withInput({ id: [taxonomyTermRoot.id], trashed: true })
      .shouldReturnData({ uuid: { setState: { success: true } } })
  })

  test('fails when static_pages_builder tries to set state of user', async () => {
    given('UuidQuery').for(
      { ...baseUser, roles: ['de_static_pages_builder'] },
      user2,
    )

    await mutation
      .withInput({ id: [user2.id], trashed: false })
      .shouldFailWithError('FORBIDDEN')
  })

  test('fails when static_pages_builder tries to set state of article', async () => {
    given('UuidQuery').for(
      { ...baseUser, roles: ['de_static_pages_builder'] },
      article,
    )

    await mutation
      .withInput({ id: [article.id], trashed: false })
      .shouldFailWithError('FORBIDDEN')
  })

  test('returns "{ success: true }" when static_pages_builder tries to set state of page', async () => {
    given('UuidQuery').for(
      { ...baseUser, roles: ['de_static_pages_builder'] },
      page,
    )

    await mutation
      .withInput({ id: [page.id], trashed: true })
      .shouldReturnData({ uuid: { setState: { success: true } } })
  })

  test('returns "{ success: true }" when static_pages_builder tries to set state of page revision', async () => {
    given('UuidQuery').for(
      { ...baseUser, roles: ['de_static_pages_builder'] },
      pageRevision,
    )

    await mutation
      .withInput({ id: [pageRevision.id], trashed: true })
      .shouldReturnData({ uuid: { setState: { success: true } } })
  })
})

// FUNCTION EXAMPLE

// async function mockUserAndUuid(userRole: string, uuidType, returnValue) {
//   given('UuidQuery').for({ ...baseUser, roles: [userRole] }, uuidType)

//   await mutation
//     .withInput({ id: [uuidType.id], trashed: true })
//     .shouldReturnData(returnValue)
// }
