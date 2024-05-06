import gql from 'graphql-tag'

import { Client } from './assertions'

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
