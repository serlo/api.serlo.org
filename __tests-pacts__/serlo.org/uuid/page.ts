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
import { page, pageAlias, pageRevision, user } from '../../../__fixtures__/uuid'
import { assertSuccessfulGraphQLQuery } from '../../__utils__/assertions'
import {
  addAliasInteraction,
  addLicenseInteraction,
  addPageInteraction,
  addPageRevisionInteraction,
  addUserInteraction,
} from '../../__utils__/interactions'

describe('Page', () => {
  test('by alias', async () => {
    await addAliasInteraction(pageAlias)
    await addPageInteraction(page)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(alias: { instance: de, path: "${pageAlias.path}" }) {
            __typename
            ... on Page {
              id
              trashed
              instance
              alias
              currentRevision {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'Page',
          ...R.omit(['currentRevisionId', 'licenseId'], page),
          currentRevision: {
            id: 35476,
          },
        },
      },
    })
  })

  test('by alias (w/ license)', async () => {
    await addAliasInteraction(pageAlias)
    await addLicenseInteraction(license)
    await addPageInteraction(page)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(alias: { instance: de, path: "${pageAlias.path}" }) {
            __typename
            ... on Page {
              id
              trashed
              instance
              alias
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
          __typename: 'Page',
          ...R.omit(['currentRevisionId', 'licenseId'], page),
          license: {
            id: 1,
            title: license.title,
          },
        },
      },
    })
  })

  test('by alias (w/ currentRevision)', async () => {
    await addAliasInteraction(pageAlias)
    await addPageRevisionInteraction(pageRevision)
    await addPageInteraction(page)
    await assertSuccessfulGraphQLQuery({
      query: gql`
      {
        uuid(alias: { instance: de, path: "${pageAlias.path}" }) {
          __typename
          ... on Page {
            id
            trashed
            instance
            alias
            currentRevision {
              id
              title
              content
            }
          }
        }
      }
    `,
      data: {
        uuid: {
          __typename: 'Page',
          ...R.omit(['currentRevisionId', 'licenseId'], page),
          currentRevision: {
            id: 35476,
            title: 'title',
            content: 'content',
          },
        },
      },
    })
  })

  test('by id', async () => {
    await addPageInteraction(page)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 19767) {
            __typename
            ... on Page {
              id
              trashed
              instance
              alias
              currentRevision {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'Page',
          ...R.omit(['currentRevisionId', 'licenseId'], page),
          currentRevision: {
            id: 35476,
          },
        },
      },
    })
  })
})

describe('PageRevision', () => {
  test('by id', async () => {
    await addPageRevisionInteraction(pageRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 35476) {
            __typename
            ... on PageRevision {
              id
              trashed
              title
              content
              date
              author {
                id
              }
              page {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'PageRevision',
          ...R.omit(['authorId', 'repositoryId'], pageRevision),
          author: {
            id: 1,
          },
          page: {
            id: 19767,
          },
        },
      },
    })
  })

  test('by id (w/ author)', async () => {
    await addUserInteraction(user)
    await addPageRevisionInteraction(pageRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 35476) {
            __typename
            ... on PageRevision {
              id
              trashed
              title
              content
              date
              author {
                id
                username
              }
              page {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'PageRevision',
          ...R.omit(['authorId', 'repositoryId'], pageRevision),
          author: { id: 1, username: user.username },
          page: {
            id: 19767,
          },
        },
      },
    })
  })

  test('by id (w/ page)', async () => {
    await addPageInteraction(page)
    await addPageRevisionInteraction(pageRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 35476) {
            __typename
            ... on PageRevision {
              id
              trashed
              title
              content
              date
              author {
                id
              }
              page {
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
          __typename: 'PageRevision',
          ...R.omit(['authorId', 'repositoryId'], pageRevision),
          author: { id: 1 },
          page: {
            id: 19767,
            currentRevision: { id: 35476 },
          },
        },
      },
    })
  })
})
