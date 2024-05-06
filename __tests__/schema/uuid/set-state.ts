import gql from 'graphql-tag'
import { HttpResponse } from 'msw'

import {
  article,
  page,
  pageRevision,
  taxonomyTermRoot,
  user as baseUser,
} from '../../../__fixtures__'
import { Client, given } from '../../__utils__'
import { generateRole } from '~/internals/graphql'
import { Instance, Role } from '~/types'

const user = { ...baseUser, roles: ['de_architect'] }
const uuids = [article, page, pageRevision, taxonomyTermRoot]
const client = new Client({ userId: user.id })
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
  given('UuidQuery').for(page, pageRevision, taxonomyTermRoot, article)
  given('UuidSetStateMutation')
    .withPayload({ userId: user.id, trashed: true })
    .isDefinedBy(async ({ request }) => {
      const body = await request.json()
      const { ids, trashed } = body.payload

      for (const id of ids) {
        const uuid = uuids.find((x) => x.id === id)

        if (uuid != null) {
          given('UuidQuery').for({ ...article, trashed })
        } else {
          return new HttpResponse(null, {
            status: 500,
          })
        }
      }

      return new HttpResponse()
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
    given('UuidQuery').for(page, pageRevision, taxonomyTermRoot, article)
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
    await testPermissionWithMockUser(Role.Architect, page.id, false)
  })

  test('fails when static_pages_builder tries to set state of article', async () => {
    await testPermissionWithMockUser(Role.StaticPagesBuilder, article.id, false)
  })

  test('fails when static_pages_builder tries to set state of taxonomy term', async () => {
    await testPermissionWithMockUser(
      Role.StaticPagesBuilder,
      taxonomyTermRoot.id,
      false,
    )
  })

  test('returns "{ success: true }" when architect tries to set state of article', async () => {
    await testPermissionWithMockUser(Role.Architect, article.id, true)
  })

  test('returns "{ success: true }" when architect tries to set state of taxonomy term', async () => {
    await testPermissionWithMockUser(Role.Architect, taxonomyTermRoot.id, true)
  })

  test('returns "{ success: true }" when static_pages_builder tries to set state of page', async () => {
    await testPermissionWithMockUser(Role.StaticPagesBuilder, page.id, true)
  })

  test('returns "{ success: true }" when static_pages_builder tries to set state of page revision', async () => {
    await testPermissionWithMockUser(
      Role.StaticPagesBuilder,
      pageRevision.id,
      true,
    )
  })

  test('returns "{ success: true }" when static_pages_builder tries to set state of page revision', async () => {
    await testPermissionWithMockUser(
      Role.StaticPagesBuilder,
      pageRevision.id,
      true,
    )
  })
})

async function testPermissionWithMockUser(
  userRole: Role,
  uuidId: number,
  successSwitch: boolean,
) {
  given('UuidQuery').for({
    ...baseUser,
    roles: [generateRole(userRole, Instance.De)],
  })

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
