import { gql } from 'apollo-server'

import {
  applet,
  appletRevision,
  getAppletDataWithoutSubResolvers,
  getAppletRevisionDataWithoutSubResolvers,
  getTaxonomyTermDataWithoutSubResolvers,
  license,
  taxonomyTermSubject,
  user,
} from '../../../__fixtures__'
import { Service } from '../../../src/graphql/schema/types'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createLicenseHandler,
  createTestClient,
  createUuidHandler,
} from '../../__utils__'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.Playground,
    user: null,
  }).client
})

describe('Applet', () => {
  beforeEach(() => {
    global.server.use(createUuidHandler(applet))
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
    global.server.use(createLicenseHandler(license))
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
    global.server.use(createUuidHandler(appletRevision))
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
    global.server.use(createUuidHandler(taxonomyTermSubject))
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

describe('AppletRevision', () => {
  beforeEach(() => {
    global.server.use(createUuidHandler(appletRevision))
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query appletRevision($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on AppletRevision {
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
      `,
      variables: appletRevision,
      data: {
        uuid: getAppletRevisionDataWithoutSubResolvers(appletRevision),
      },
      client,
    })
  })

  test('by id (w/ author)', async () => {
    global.server.use(createUuidHandler(user))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query applet($id: Int!) {
          uuid(id: $id) {
            ... on AppletRevision {
              author {
                __typename
                id
                trashed
                username
                date
                lastLogin
                description
              }
            }
          }
        }
      `,
      variables: appletRevision,
      data: {
        uuid: {
          author: user,
        },
      },
      client,
    })
  })

  test('by id (w/ applet)', async () => {
    global.server.use(createUuidHandler(applet))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query applet($id: Int!) {
          uuid(id: $id) {
            ... on AppletRevision {
              applet {
                __typename
                id
                trashed
                instance
                alias
                date
              }
            }
          }
        }
      `,
      variables: appletRevision,
      data: {
        uuid: {
          applet: getAppletDataWithoutSubResolvers(applet),
        },
      },
      client,
    })
  })
})
