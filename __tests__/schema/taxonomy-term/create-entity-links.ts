import gql from 'graphql-tag'

import { exercise } from '../../../__fixtures__'
import { Client } from '../../__utils__'
import { taxonomyTermQuery } from '../uuid/taxonomy-term'

const input = {
  entityIds: [32321, 1855],
  taxonomyTermId: 1314,
}

const mutation = new Client({ userId: 1 }).prepareQuery({
  query: gql`
    mutation ($input: TaxonomyEntityLinksInput!) {
      taxonomyTerm {
        createEntityLinks(input: $input) {
          success
        }
      }
    }
  `,
  variables: { input },
})

test('adds links to taxonomies', async () => {
  await taxonomyTermQuery
    .withVariables({ id: input.taxonomyTermId })
    .shouldReturnData({
      uuid: {
        children: {
          nodes: [{ id: 25614 }, { id: 1501 }, { id: 1589 }, { id: 29910 }],
        },
      },
    })

  await mutation.shouldReturnData({
    taxonomyTerm: {
      createEntityLinks: {
        success: true,
      },
    },
  })

  await taxonomyTermQuery
    .withVariables({ id: input.taxonomyTermId })
    .shouldReturnData({
      uuid: {
        children: {
          nodes: [
            { id: 25614 },
            { id: 1501 },
            { id: 1589 },
            { id: 29910 },
            { id: 32321 },
            { id: 1855 },
          ],
        },
      },
    })
})

test('fails when instance does not match', async () => {
  const englishEntityId = 35598

  await mutation
    .changeInput({ entityIds: [englishEntityId] })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when exercise shall be added to non exercise folders', async () => {
  await mutation
    .changeInput({ entityIds: [exercise.id] })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when non exercise shall be added to exercise folders', async () => {
  await mutation
    .changeInput({ taxonomyIds: [35562] })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when taxonomyTermId does not belong to taxonomy', async () => {
  await mutation
    .changeInput({ taxonomyId: input.entityIds[1] })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when one child is no entity', async () => {
  await mutation
    .changeInput({ entityIds: [1] })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "architect"', async () => {
  await mutation.forLoginUser().shouldFailWithError('FORBIDDEN')
})
