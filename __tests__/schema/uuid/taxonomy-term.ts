import gql from 'graphql-tag'

import { Client } from '../../__utils__'

export const taxonomyTermQuery = new Client().prepareQuery({
  query: gql`
    query ($id: Int!) {
      uuid(id: $id) {
        __typename
        ... on TaxonomyTerm {
          id
          trashed
          type
          instance
          alias
          title
          name
          description
          weight
          taxonomyId
          path {
            id
          }
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
  `,
})

test('TaxonomyTerm root', async () => {
  await taxonomyTermQuery.withVariables({ id: 3 }).shouldReturnData({
    uuid: {
      __typename: 'TaxonomyTerm',
      id: 3,
      trashed: false,
      type: 'root',
      instance: 'de',
      alias: '/root/3/root',
      title: 'Root',
      name: 'Root',
      description: null,
      weight: 0,
      taxonomyId: 1,
      path: [],
      parent: null,
      children: {
        nodes: [
          { id: 26876 },
          { id: 26882 },
          { id: 33894 },
          { id: 35608 },
          { id: 25712 },
          { id: 25979 },
          { id: 26523 },
          { id: 8 },
          { id: 24798 },
          { id: 15465 },
          { id: 23382 },
          { id: 23362 },
          { id: 17746 },
          { id: 18234 },
          { id: 17744 },
          { id: 20605 },
          { id: 5 },
          { id: 18230 },
        ],
      },
    },
  })
})

test('TaxonomyTerm subject', async () => {
  await taxonomyTermQuery.withVariables({ id: 18230 }).shouldReturnData({
    uuid: {
      __typename: 'TaxonomyTerm',
      id: 18230,
      trashed: false,
      type: 'subject',
      instance: 'de',
      alias: '/chemie/18230/chemie',
      title: 'Chemie',
      name: 'Chemie',
      description: '',
      weight: 17,
      taxonomyId: 3,
      path: [],
      parent: { id: 3 },
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
})

test('TaxonomyTerm exerciseFolder', async () => {
  await taxonomyTermQuery.withVariables({ id: 35562 }).shouldReturnData({
    uuid: {
      __typename: 'TaxonomyTerm',
      id: 35562,
      trashed: false,
      type: 'exerciseFolder',
      instance: 'en',
      alias: '/math/35562/example-topic-folder',
      title: 'Example topic folder',
      name: 'Example topic folder',
      description: '',
      weight: 1,
      taxonomyId: 19,
      path: [{ id: 23590 }, { id: 23593 }, { id: 35559 }, { id: 35560 }],
      parent: {
        id: 35560,
      },
      children: {
        nodes: [{ id: 35573 }, { id: 35579 }, { id: 35580 }],
      },
    },
  })
})
