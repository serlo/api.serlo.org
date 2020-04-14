import { gql } from 'apollo-server'
import * as R from 'ramda'

import { license } from '../../__fixtures__/license'
import {
  applet,
  appletAlias,
  appletRevision,
  taxonomyTermSubject,
  user,
} from '../../__fixtures__/uuid'
import { assertSuccessfulGraphQLQuery } from '../__utils__/assertions'
import {
  addAliasInteraction,
  addAppletInteraction,
  addAppletRevisionInteraction,
  addLicenseInteraction,
  addTaxonomyTermInteraction,
  addUserInteraction,
} from '../__utils__/interactions'

describe('Applet', () => {
  test('by alias', async () => {
    await addAppletInteraction(applet)
    await addAliasInteraction(appletAlias)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${appletAlias.path}"
              }
            ) {
              __typename
              ... on Applet {
                id
                trashed
                instance
                alias
                date
                currentRevision {
                  id
                }
                license {
                  id
                }
              }
            }
          }
        `,
      data: {
        uuid: {
          __typename: 'Applet',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds'],
            applet
          ),
          currentRevision: {
            id: appletRevision.id,
          },
          license: {
            id: 1,
          },
        },
      },
    })
  })

  test('by alias (w/ license)', async () => {
    await addAppletInteraction(applet)
    await addAliasInteraction(appletAlias)
    await addLicenseInteraction(license)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(
            alias: {
              instance: de
              path: "${appletAlias.path}"
            }
          ) {
            __typename
            ... on Applet {
              id
              trashed
              instance
              alias
              date
              currentRevision {
                id
              }
              license {
                id
                title
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'Applet',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds'],
            applet
          ),
          currentRevision: {
            id: appletRevision.id,
          },
          license: {
            id: 1,
            title: 'title',
          },
        },
      },
    })
  })

  test('by alias (w/ currentRevision)', async () => {
    await addAppletInteraction(applet)
    await addAliasInteraction(appletAlias)
    await addAppletRevisionInteraction(appletRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${appletAlias.path}"
              }
            ) {
              __typename
              ... on Applet {
                id
                trashed
                instance
                alias
                date
                currentRevision {
                  id
                  title
                  content
                  changes
                }
              }
            }
          }
        `,
      data: {
        uuid: {
          __typename: 'Applet',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds'],
            applet
          ),
          currentRevision: {
            id: appletRevision.id,
            title: 'title',
            content: 'content',
            changes: 'changes',
          },
        },
      },
    })
  })

  test('by alias (w/ taxonomyTerms)', async () => {
    await addAppletInteraction(applet)
    await addAliasInteraction(appletAlias)
    await addTaxonomyTermInteraction(taxonomyTermSubject)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(
            alias: {
              instance: de
              path: "${appletAlias.path}"
            }
          ) {
            __typename
            ... on Applet {
              id
              trashed
              instance
              alias
              date
              taxonomyTerms {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'Applet',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds'],
            applet
          ),
          taxonomyTerms: [{ id: 5 }],
        },
      },
    })
  })

  test('by id', async () => {
    await addAppletInteraction(applet)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${applet.id}) {
            __typename
            ... on Applet {
              id
              trashed
              alias
              instance
              date
              currentRevision {
                id
              }
              license {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'Applet',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds'],
            applet
          ),
          currentRevision: {
            id: appletRevision.id,
          },
          license: {
            id: 1,
          },
        },
      },
    })
  })
})

describe('AppletRevision', () => {
  test('by id', async () => {
    await addAppletRevisionInteraction(appletRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${appletRevision.id}) {
            __typename
            ... on AppletRevision {
              id
              trashed
              date
              title
              content
              url
              changes
              author {
                id
              }
              applet {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'AppletRevision',
          ...R.omit(['authorId', 'repositoryId'], appletRevision),
          author: {
            id: 1,
          },
          applet: {
            id: applet.id,
          },
        },
      },
    })
  })

  test('by id (w/ author)', async () => {
    await addAppletRevisionInteraction(appletRevision)
    await addUserInteraction(user)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${appletRevision.id}) {
            __typename
            ... on AppletRevision {
              id
              trashed
              date
              title
              content
              url
              changes
              author {
                id
                username
              }
              applet {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'AppletRevision',
          ...R.omit(['authorId', 'repositoryId'], appletRevision),
          author: {
            id: 1,
            username: user.username,
          },
          applet: {
            id: applet.id,
          },
        },
      },
    })
  })

  test('by id (w/ applet)', async () => {
    await addAppletRevisionInteraction(appletRevision)
    await addAppletInteraction(applet)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${appletRevision.id}) {
            __typename
            ... on AppletRevision {
              id
              trashed
              date
              title
              content
              url
              changes
              author {
                id
              }
              applet {
                id
                currentRevision {
                  id
                }
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'AppletRevision',
          ...R.omit(['authorId', 'repositoryId'], appletRevision),
          author: {
            id: 1,
          },
          applet: {
            id: applet.id,
            currentRevision: {
              id: appletRevision.id,
            },
          },
        },
      },
    })
  })
})
