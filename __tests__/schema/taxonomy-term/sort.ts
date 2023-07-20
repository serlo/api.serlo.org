import { gql } from 'apollo-server'
import { GraphQLError } from 'graphql'

import {
  article,
  taxonomyTermSubject,
  user as baseUser,
} from '../../../__fixtures__'
import { castToUuid, Client, given } from '../../__utils__'

const user = { ...baseUser, roles: ['de_architect'] }

const taxonomyTerm = {
  ...taxonomyTermSubject,
  childrenIds: [23453, 1454, 1394].map(castToUuid),
}
const input = {
  childrenIds: [1394, 23453, 1454].map(castToUuid),
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

  given('TaxonomySortMutation').isDefinedBy((req, res, ctx) => {
    const { childrenIds } = req.body.payload
    if (
      [...childrenIds].sort().join(',') !==
      [...taxonomyTerm.childrenIds].sort().join(',')
    ) {
      throw new GraphQLError(
        'children_ids have to match the current entities ids linked to the taxonomy_term_id',
        {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        },
      )
    }

    given('UuidQuery').for({
      ...taxonomyTerm,
      childrenIds: childrenIds.map(castToUuid),
    })

    return res(ctx.json({ success: true }))
  })
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  await mutation.shouldReturnData({
    taxonomyTerm: { sort: { success: true } },
  })
})

test('is successful even though user have not sent all children ids', async () => {
  await mutation
    .withInput({ ...input, childrenIds: [1394, 23453].map(castToUuid) })
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

test('updates the cache', async () => {
  given('UuidQuery').for(
    { ...article, id: castToUuid(1394) },
    { ...taxonomyTermSubject, id: castToUuid(23453) },
    { ...article, id: castToUuid(1454) },
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
