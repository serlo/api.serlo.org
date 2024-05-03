import gql from 'graphql-tag'
import { HttpResponse } from 'msw'

import {
  article,
  taxonomyTermSubject,
  user as baseUser,
} from '../../../__fixtures__'
import { Client, given } from '../../__utils__'
import { UserInputError } from '~/errors'

const user = { ...baseUser, roles: ['de_architect'] }

const taxonomyTerm = {
  ...taxonomyTermSubject,
  childrenIds: [23453, 1454, 1394],
}
const input = {
  childrenIds: [1394, 23453, 1454],
  taxonomyTermId: taxonomyTerm.id,
}

const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation ($input: TaxonomyTermSortInput!) {
        taxonomyTerm {
          sort(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput(input)

beforeEach(() => {
  given('UuidQuery').for(user, taxonomyTerm)

  given('TaxonomySortMutation').isDefinedBy(async ({ request }) => {
    const body = await request.json()
    const { childrenIds } = body.payload
    if (
      [...childrenIds].sort().join(',') !==
      [...taxonomyTerm.childrenIds].sort().join(',')
    ) {
      throw new UserInputError(
        'children_ids have to match the current entities ids linked to the taxonomy_term_id',
      )
    }

    given('UuidQuery').for({ ...taxonomyTerm, childrenIds })

    return HttpResponse.json({ success: true })
  })
})

test.skip('returns "{ success: true }" when mutation could be successfully executed', async () => {
  await mutation.shouldReturnData({
    taxonomyTerm: { sort: { success: true } },
  })
})

test.skip('is successful even though user have not sent all children ids', async () => {
  await mutation
    .withInput({ ...input, childrenIds: [1394, 23453] })
    .shouldReturnData({
      taxonomyTerm: { sort: { success: true } },
    })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "architect"', async () => {
  await mutation.forLoginUser().shouldFailWithError('FORBIDDEN')
})

test('fails when database layer returns a 400er response', async () => {
  given('TaxonomySortMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('TaxonomySortMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})

test.skip('updates the cache', async () => {
  given('UuidQuery').for(
    { ...article, id: 1394 },
    { ...taxonomyTermSubject, id: 23453 },
    { ...article, id: 1454 },
  )

  const query = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on TaxonomyTerm {
              children {
                nodes {
                  id
                }
              }
            }
          }
        }
      `,
    })
    .withVariables({ id: taxonomyTerm.id })

  await query.shouldReturnData({
    uuid: {
      children: {
        nodes: [{ id: 23453 }, { id: 1454 }, { id: 1394 }],
      },
    },
  })

  await mutation.execute()

  await query.shouldReturnData({
    uuid: {
      children: {
        nodes: [{ id: 1394 }, { id: 23453 }, { id: 1454 }],
      },
    },
  })
})
