/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'
import * as R from 'ramda'

import { license } from '../../../__fixtures__/license'
import {
  applet,
  appletRevision,
  taxonomyTermSubject,
  user,
} from '../../../__fixtures__/uuid'
import { assertSuccessfulGraphQLQuery } from '../../__utils__/assertions'
import {
  addAppletInteraction,
  addAppletRevisionInteraction,
  addLicenseInteraction,
  addTaxonomyTermInteraction,
  addUserInteraction,
} from '../../__utils__/interactions'

describe('Applet', () => {
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

  test('by id (w/ license)', async () => {
    await addAppletInteraction(applet)
    await addLicenseInteraction(license)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${applet.id}) {
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

  test('by id (w/ currentRevision)', async () => {
    await addAppletInteraction(applet)
    await addAppletRevisionInteraction(appletRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(id: ${applet.id}) {
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

  test('by id (w/ taxonomyTerms)', async () => {
    await addAppletInteraction(applet)
    await addTaxonomyTermInteraction(taxonomyTermSubject)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${applet.id}) {
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
              metaTitle
              metaDescription
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
              metaTitle
              metaDescription
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
              metaTitle
              metaDescription
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
