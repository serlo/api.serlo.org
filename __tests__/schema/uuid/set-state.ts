import gql from 'graphql-tag'
import { HttpResponse } from 'msw'

import { article, page, user as baseUser } from '../../../__fixtures__'
import { nextUuid, Client, given } from '../../__utils__'

const user = { ...baseUser, roles: ['de_architect'] }
const articleIds = [article.id, nextUuid(article.id)]
const client = new Client({ userId: user.id })
const mutation = client
  .prepareQuery({
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
  .withInput({ id: articleIds, trashed: true })

beforeEach(() => {
  const articles = articleIds.map((id) => {
    return { ...article, id }
  })

  given('UuidQuery').for(user, articles)
  given('UuidSetStateMutation')
    .withPayload({ userId: user.id, trashed: true })
    .isDefinedBy(async ({ request }) => {
      const body = await request.json()
      const { ids, trashed } = body.payload

      for (const id of ids) {
        const article = articles.find((x) => x.id === id)

        if (article != null) {
          article.trashed = trashed
        } else {
          return new HttpResponse(null, {
            status: 500,
          })
        }
      }

      return new Response()
    })
})

test('returns "{ success: true }" when it succeeds', async () => {
  await mutation.shouldReturnData({ uuid: { setState: { success: true } } })
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
  await mutation.execute()

  await uuidQuery.shouldReturnData({ uuid: { trashed: true } })
})

test('fails when database layer returns a BadRequest response', async () => {
  given('UuidSetStateMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have sufficient permissions', async () => {
  // Architects are not allowed to set the state of pages.
  given('UuidQuery').for(page)

  await mutation
    .withInput({ id: [page.id], trashed: false })
    .shouldFailWithError('FORBIDDEN')
})

test('fails when database layer has an internal server error', async () => {
  given('UuidSetStateMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
