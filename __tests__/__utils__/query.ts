import gql from 'graphql-tag'

import { Client } from './assertions'

export const entityQuery = new Client().prepareQuery({
  query: gql`
    query ($id: Int!) {
      uuid(id: $id) {
        ... on Article {
          __typename
          id
          instance
          alias
          trashed
          date
          title
          licenseId
          currentRevision {
            id
          }
          revisions {
            nodes {
              id
            }
          }
          taxonomyTerms {
            nodes {
              id
            }
          }
        }
      }
    }
  `,
  variables: { id: 27801 },
})

export const entityRevisionQuery = new Client().prepareQuery({
  query: gql`
    query ($id: Int!) {
      uuid(id: $id) {
        ... on ArticleRevision {
          __typename
          id
          author {
            id
          }
          trashed
          alias
          date
          repository {
            id
          }
          title
          content
          changes
          metaTitle
          metaDescription
          url
        }
      }
    }
  `,
  variables: { id: 35296 },
})

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
