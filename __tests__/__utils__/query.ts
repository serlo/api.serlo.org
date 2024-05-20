import gql from 'graphql-tag'

import { Client } from './assertions'

export const entityQuery = new Client().prepareQuery({
  query: gql`
    query ($id: Int!) {
      uuid(id: $id) {
        ... on AbstractUuid {
          alias
        }
        ... on AbstractEntity {
          __typename
          id
          instance
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
        }
        ... on AbstractTaxonomyTermChild {
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
        ... on AbstractUuid {
          alias
        }
        ... on AbstractEntityRevision {
          __typename
          id
          author {
            id
          }
          trashed
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

export const userQuery = new Client().prepareQuery({
  query: gql`
    query ($id: Int!) {
      uuid(id: $id) {
        ... on User {
          unrevisedEntities {
            nodes {
              id
            }
          }
        }
      }
    }
  `,
  variables: { id: 299 },
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

export const subscriptionsQuery = new Client({ userId: 27393 }).prepareQuery({
  query: gql`
    query {
      subscription {
        getSubscriptions {
          nodes {
            object {
              id
            }
            sendEmail
          }
        }
      }
    }
  `,
})
