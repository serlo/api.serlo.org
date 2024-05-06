import gql from 'graphql-tag'

import { Client, taxonomyTermQuery } from '../../__utils__'

const input = {
  childrenIds: [18888, 18887, 21069, 18884, 23256, 18232, 18885, 18886],
  taxonomyTermId: 18230,
}

const mutation = new Client({ userId: 1 })
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

test('changes order of children', async () => {
  await taxonomyTermQuery.withVariables({ id: 18230 }).shouldReturnData({
    uuid: {
      children: {
        nodes: [
          { id: 21069 },
          { id: 18232 },
          { id: 18884 },
          { id: 18885 },
          { id: 18886 },
          { id: 23256 },
          { id: 18887 },
          { id: 18888 },
        ],
      },
    },
  })

  await mutation.shouldReturnData({
    taxonomyTerm: { sort: { success: true } },
  })

  await taxonomyTermQuery.withVariables({ id: 18230 }).shouldReturnData({
    uuid: {
      children: {
        nodes: [
          { id: 18888 },
          { id: 18887 },
          { id: 21069 },
          { id: 18884 },
          { id: 23256 },
          { id: 18232 },
          { id: 18885 },
          { id: 18886 },
        ],
      },
    },
  })
})

test('fails when some childIds are not in the taxonomy', async () => {
  await mutation
    .changeInput({ childrenIds: [5] })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "architect"', async () => {
  await mutation.forLoginUser().shouldFailWithError('FORBIDDEN')
})
