import gql from 'graphql-tag'

import { Client, taxonomyTermQuery } from '../../__utils__'

const input = {
  entityIds: [29910, 1501],
  taxonomyTermId: 1314,
}

const mutation = new Client({ userId: 1 })
  .prepareQuery({
    query: gql`
      mutation ($input: TaxonomyEntityLinksInput!) {
        taxonomyTerm {
          deleteEntityLinks(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput(input)

test('deletes entity links from taxonomy', async () => {
  await taxonomyTermQuery
    .withVariables({ id: input.taxonomyTermId })
    .shouldReturnData({
      uuid: {
        children: {
          nodes: [{ id: 25614 }, { id: 1501 }, { id: 1589 }, { id: 29910 }],
        },
      },
    })

  // TDODO: After we have migrated the entities we should test that
  // their taxonomyTermIds. have also changed

  await mutation.shouldReturnData({
    taxonomyTerm: { deleteEntityLinks: { success: true } },
  })

  await taxonomyTermQuery
    .withVariables({ id: input.taxonomyTermId })
    .shouldReturnData({
      uuid: {
        children: {
          nodes: [{ id: 25614 }, { id: 1589 }],
        },
      },
    })
})

test('fails when taxonomyTermId does not belong to taxonomy', async () => {
  await mutation
    .changeInput({ termTaxonomyId: 1 })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when a child is only linked to one taxonomy', async () => {
  await mutation
    .changeInput({ termTaxonomyId: 35562, entityIds: [25614] })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "architect"', async () => {
  await mutation.forLoginUser().shouldFailWithError('FORBIDDEN')
})
