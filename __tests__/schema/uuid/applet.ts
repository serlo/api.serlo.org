import { gql } from 'apollo-server'
import { setupServer } from 'msw/node'

import {
  applet,
  appletRevision,
  license,
  taxonomyTermSubject,
  getAppletDataWithoutSubResolvers,
  getAppletRevisionDataWithoutSubResolvers,
  getTaxonomyTermDataWithoutSubResolvers,
} from '../../../__fixtures__'
import { Service } from '../../../src/graphql/schema/types'
import { assertSuccessfulGraphQLQuery } from '../../__utils__/assertions'
import {
  createLicenseHandler,
  createUuidHandler,
} from '../../__utils__/handlers'
import { Client, createTestClient } from '../../__utils__/test-client'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.Playground,
    user: null,
  }).client
})

describe('Applet', () => {
  const server = setupServer(createUuidHandler(applet))

  beforeAll(() => {
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query applet($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on Applet {
              id
              trashed
              instance
              alias
              date
            }
          }
        }
      `,
      variables: applet,
      data: {
        uuid: getAppletDataWithoutSubResolvers(applet),
      },
      client,
    })
  })

  test('by id (w/ license)', async () => {
    server.use(createLicenseHandler(license))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query applet($id: Int!) {
          uuid(id: $id) {
            ... on Applet {
              license {
                id
                instance
                default
                title
                url
                content
                agreement
                iconHref
              }
            }
          }
        }
      `,
      variables: applet,
      data: {
        uuid: {
          license,
        },
      },
      client,
    })
  })

  test('by id (w/ currentRevision)', async () => {
    server.use(createUuidHandler(appletRevision))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query applet($id: Int!) {
          uuid(id: $id) {
            ... on Applet {
              currentRevision {
                __typename
                id
                trashed
                date
                url
                title
                content
                changes
                metaTitle
                metaDescription
              }
            }
          }
        }
      `,
      variables: applet,
      data: {
        uuid: {
          currentRevision: getAppletRevisionDataWithoutSubResolvers(
            appletRevision
          ),
        },
      },
      client,
    })
  })

  test('by id (w/ taxonomyTerms)', async () => {
    server.use(createUuidHandler(taxonomyTermSubject))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query applet($id: Int!) {
          uuid(id: $id) {
            ... on Applet {
              taxonomyTerms {
                __typename
                id
                trashed
                type
                instance
                alias
                name
                description
                weight
              }
            }
          }
        }
      `,
      variables: applet,
      data: {
        uuid: {
          taxonomyTerms: [
            getTaxonomyTermDataWithoutSubResolvers(taxonomyTermSubject),
          ],
        },
      },
      client,
    })
  })
})
