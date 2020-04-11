import { gql } from 'apollo-server'
import * as R from 'ramda'

import {
  taxonomyTermCurriculumTopic,
  taxonomyTermRoot,
  taxonomyTermSubject,
} from '../../__fixtures__/uuid'
import { assertSuccessfulGraphQLQuery } from '../__utils__/assertions'
import { addTaxonomyTermInteraction } from '../__utils__/interactions'

test('by id (subject)', async () => {
  await addTaxonomyTermInteraction(taxonomyTermRoot)
  await addTaxonomyTermInteraction(taxonomyTermSubject)
  await addTaxonomyTermInteraction(taxonomyTermCurriculumTopic)
  await assertSuccessfulGraphQLQuery({
    query: gql`
      {
        uuid(id: 5) {
          __typename
          ... on TaxonomyTerm {
            id
            type
            trashed
            instance
            alias
            name
            description
            weight

            parent {
              id
              alias
            }

            children {
              id
            }
          }
        }
      }
    `,
    data: {
      uuid: {
        __typename: 'TaxonomyTerm',
        ...R.omit(['parentId', 'childrenIds'], taxonomyTermSubject),
        parent: {
          id: 3,
          alias: null,
        },
        children: [
          {
            id: 16048,
          },
        ],
      },
    },
  })
})

test('by id (subject, w/ path)', async () => {
  await addTaxonomyTermInteraction(taxonomyTermRoot)
  await addTaxonomyTermInteraction(taxonomyTermSubject)
  await addTaxonomyTermInteraction(taxonomyTermCurriculumTopic)
  await assertSuccessfulGraphQLQuery({
    query: gql`
      {
        uuid(id: 5) {
          __typename
          ... on TaxonomyTerm {
            id
            type
            trashed
            instance
            alias
            name
            description
            weight

            parent {
              id
            }

            children {
              id
            }

            path {
              id
            }
          }
        }
      }
    `,
    data: {
      uuid: {
        __typename: 'TaxonomyTerm',
        ...R.omit(['parentId', 'childrenIds'], taxonomyTermSubject),

        parent: {
          id: 3,
        },

        children: [
          {
            id: 16048,
          },
        ],

        path: [{ id: 3 }, { id: 5 }],
      },
    },
  })
})

test('by id (curriculum-topic)', async () => {
  await addTaxonomyTermInteraction(taxonomyTermCurriculumTopic)
  await assertSuccessfulGraphQLQuery({
    query: gql`
      {
        uuid(id: 16048) {
          __typename
          ... on TaxonomyTerm {
            id
            type
            trashed
            instance
            alias
            name
            description
            weight
          }
        }
      }
    `,
    data: {
      uuid: {
        __typename: 'TaxonomyTerm',
        ...R.omit(['parentId', 'childrenIds'], taxonomyTermCurriculumTopic),
      },
    },
  })
})
