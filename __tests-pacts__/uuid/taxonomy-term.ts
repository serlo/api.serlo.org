import { gql } from 'apollo-server'
import * as R from 'ramda'

import {
  navigation,
  page,
  taxonomyTermCurriculumTopic,
  taxonomyTermRoot,
  taxonomyTermSubject,
} from '../../__fixtures__/uuid'
import { assertSuccessfulGraphQLQuery } from '../__utils__/assertions'
import {
  addNavigationInteraction,
  addPageInteraction,
  addTaxonomyTermInteraction,
} from '../__utils__/interactions'

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

test('by id (subject, w/ navigation)', async () => {
  await addPageInteraction(page)
  await addTaxonomyTermInteraction(taxonomyTermRoot)
  await addTaxonomyTermInteraction(taxonomyTermSubject)
  await addTaxonomyTermInteraction(taxonomyTermCurriculumTopic)
  await addNavigationInteraction(navigation)
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

            navigation {
              data
              path {
                label
                id
                url
              }
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

        navigation: {
          data: JSON.stringify((JSON.parse(navigation.data) as unknown[])[0]),
          path: [
            {
              label: 'Mathematik',
              id: page.id,
              url: page.alias,
            },
            {
              label: 'Alle Themen',
              id: taxonomyTermSubject.id,
              url: taxonomyTermSubject.alias,
            },
          ],
        },
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
