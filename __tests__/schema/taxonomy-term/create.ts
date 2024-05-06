import gql from 'graphql-tag'

import { Client } from '../../__utils__'
import { TaxonomyTypeCreateOptions } from '~/types'

const input = {
  parentId: 18230,
  name: 'a name',
  description: 'a description',
  taxonomyType: TaxonomyTypeCreateOptions.Topic,
}
const taxonomyTypes = Object.values(TaxonomyTypeCreateOptions)

const mutation = new Client({ userId: 1 })
  .prepareQuery({
    query: gql`
      mutation set($input: TaxonomyTermCreateInput!) {
        taxonomyTerm {
          create(input: $input) {
            success
            record {
              id
              trashed
              type
              instance
              name
              description
              weight
              parent {
                id
              }
              children {
                nodes {
                  id
                }
              }
            }
          }
        }
      }
    `,
  })
  .withVariables({ input })

describe('creates a new taxonomy term', () => {
  test.each(taxonomyTypes)('%s', async (taxonomyType) => {
    await mutation.changeInput({ taxonomyType }).shouldReturnData({
      taxonomyTerm: {
        create: {
          success: true,
          record: {
            trashed: false,
            type: taxonomyType,
            instance: 'de',
            name: input.name,
            description: input.description,
            weight: 10,
            parent: { id: input.parentId },
            children: { nodes: [] },
          },
        },
      },
    })
  })
})

test('cache of parent is updated', async () => {
  const query = new Client().prepareQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          ... on TaxonomyTerm {
            children {
              nodes {
                ... on TaxonomyTerm {
                  id
                }
              }
            }
          }
        }
      }
    `,
    variables: { id: input.parentId },
  })

  await query.shouldReturnData({
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

  const data = (await mutation.getData()) as {
    taxonomyTerm: { create: { record: { id: number } } }
  }

  await query.shouldReturnData({
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
          { id: data.taxonomyTerm.create.record.id },
        ],
      },
    },
  })
})

test('fails when parent is not a taxonomy term', async () => {
  await mutation
    .changeInput({ parentId: 1 })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when parent is a exercise folder', async () => {
  await mutation
    .changeInput({ parentId: 35562 })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "architect"', async () => {
  await mutation.forLoginUser().shouldFailWithError('FORBIDDEN')
})
