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
        const uuid = uuids.find((x) => x.id === id)

        if (uuid != null) {
          uuid.trashed = trashed
        } else {
          return res(ctx.status(500))
        }
      }

      return res(ctx.status(200))
    })
})

describe('infrastructural testing', () => {
  beforeEach(() => {
    given('UuidQuery').for(
      { ...baseUser, roles: ['de_architect'] },
      { ...article, trashed: false },
    )
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

    await uuidQuery.shouldReturnData({ uuid: { trashed: false } })
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
  beforeEach(() => {
    given('UuidQuery').for(page, pageRevision, taxonomyTermRoot, user2, article)
  })

  test('fails when user is not authenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .withInput({ id: [article.id], trashed: true })
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('fails when login user tries to set state of page', async () => {
    await mockUser('login', page.id, 'fail')
  })

  test('fails when login user tries to set state of page revision', async () => {
    await mockUser('login', pageRevision.id, 'fail')
  })

  test('fails when architect tries to set state of page', async () => {
    await mockUser('de_architect', page.id, 'fail')
  })

  test('fails when architect tries to set state of user', async () => {
    await mockUser('de_architect', user2.id, 'fail')
  })

  test('returns "{ success: true }" when architect tries to set state of article', async () => {
    await mockUser('de_architect', article.id, 'success')
  })

  test('returns "{ success: true }" when architect tries to set state of taxonomy term', async () => {
    await mockUser('de_architect', taxonomyTermRoot.id, 'success')
  })

  test('fails when static_pages_builder tries to set state of user', async () => {
    await mockUser('de_static_pages_builder', user2.id, 'fail')
  })

  test('fails when static_pages_builder tries to set state of article', async () => {
    await mockUser('de_static_pages_builder', article.id, 'fail')
  })

  test('returns "{ success: true }" when static_pages_builder tries to set state of page', async () => {
    await mockUser('de_static_pages_builder', page.id, 'success')
  })

  test('returns "{ success: true }" when static_pages_builder tries to set state of page revision', async () => {
    await mockUser('de_static_pages_builder', pageRevision.id, 'success')
  })
})

async function mockUser(
  userRole: string,
  uuidId: number,
  successSwitch: string,
) {
  given('UuidQuery').for({ ...baseUser, roles: [userRole] })

  if (successSwitch === 'success') {
    await mutation
      .withInput({ id: [uuidId], trashed: true })
      .shouldReturnData({ uuid: { setState: { success: true } } })
  } else if (successSwitch === 'fail') {
    await mutation
      .withInput({ id: [uuidId], trashed: true })
      .shouldFailWithError('FORBIDDEN')
  }
}
