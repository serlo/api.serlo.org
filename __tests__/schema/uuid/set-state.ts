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
import { generateRole } from '~/internals/graphql'
import { Instance, Role } from '~/types'

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
    await testPermissionWithMockUser(Role.Login, page.id, false)
  })

  test('fails when login user tries to set state of page revision', async () => {
    await testPermissionWithMockUser(Role.Login, pageRevision.id, false)
  })

  test('fails when architect tries to set state of page', async () => {
    await testPermissionWithMockUser(
      generateRole(Role.Architect, Instance.De),
      page.id,
      false,
    )
  })

  test('fails when architect tries to set state of user', async () => {
    await testPermissionWithMockUser(
      generateRole(Role.Architect, Instance.De),
      user2.id,
      false,
    )
  })

  test('fails when static_pages_builder tries to set state of user', async () => {
    await testPermissionWithMockUser(
      generateRole(Role.StaticPagesBuilder, Instance.De),
      user2.id,
      false,
    )
  })

  test('fails when static_pages_builder tries to set state of article', async () => {
    await testPermissionWithMockUser(
      generateRole(Role.StaticPagesBuilder, Instance.De),
      article.id,
      false,
    )
  })

  test('fails when static_pages_builder tries to set state of taxonomy term', async () => {
    await testPermissionWithMockUser(
      generateRole(Role.StaticPagesBuilder, Instance.De),
      taxonomyTermRoot.id,
      false,
    )
  })

  test('returns "{ success: true }" when architect tries to set state of article', async () => {
    await testPermissionWithMockUser(
      generateRole(Role.Architect, Instance.De),
      article.id,
      true,
    )
  })

  test('returns "{ success: true }" when architect tries to set state of taxonomy term', async () => {
    await testPermissionWithMockUser(
      generateRole(Role.Architect, Instance.De),
      taxonomyTermRoot.id,
      true,
    )
  })

  test('returns "{ success: true }" when static_pages_builder tries to set state of page', async () => {
    await testPermissionWithMockUser(
      generateRole(Role.StaticPagesBuilder, Instance.De),
      page.id,
      true,
    )
  })

  test('returns "{ success: true }" when static_pages_builder tries to set state of page revision', async () => {
    await testPermissionWithMockUser(
      generateRole(Role.StaticPagesBuilder, Instance.De),
      pageRevision.id,
      true,
    )
  })

  test('returns "{ success: true }" when static_pages_builder tries to set state of page revision', async () => {
    await testPermissionWithMockUser(
      generateRole(Role.StaticPagesBuilder, Instance.De),
      pageRevision.id,
      true,
    )
  })

  test('returns "{ success: true }" when architect tries to set state of user', async () => {
    await testPermissionWithMockUser(
      generateRole(Role.Admin, Instance.De),
      user2.id,
      true,
    )
  })
})

async function testPermissionWithMockUser(
  userRole: string,
  uuidId: number,
  successSwitch: boolean,
) {
  given('UuidQuery').for({ ...baseUser, roles: [userRole] })

  if (successSwitch) {
    await mutation
      .withInput({ id: [uuidId], trashed: true })
      .shouldReturnData({ uuid: { setState: { success: true } } })
  } else if (!successSwitch) {
    await mutation
      .withInput({ id: [uuidId], trashed: true })
      .shouldFailWithError('FORBIDDEN')
  }
}
