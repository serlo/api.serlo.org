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

export const threadsQuery = new Client().prepareQuery({
  query: gql`
    query thread($id: Int!, $archived: Boolean) {
      uuid(id: $id) {
        ... on ThreadAware {
          threads(archived: $archived) {
            nodes {
              id
              title
              createdAt
              archived
              object {
                id
              }
              comments {
                nodes {
                  id
                  content
                  createdAt
                  archived
                  legacyObject {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
})

export const subjectQuery = new Client().prepareQuery({
  query: gql`
    query ($instance: Instance!) {
      subject {
        subjects(instance: $instance) {
          id
          taxonomyTerm {
            name
          }
        }
      }
    }
  `,
  variables: { instance: 'de' },
})
