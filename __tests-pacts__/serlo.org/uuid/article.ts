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

import {
  article,
  articleAlias,
  articleRevision,
  license,
  taxonomyTermSubject,
  user,
} from '../../../__fixtures__'
import { assertSuccessfulGraphQLQuery } from '../../__utils__/assertions'
import {
  addAliasInteraction,
  addArticleInteraction,
  addArticleRevisionInteraction,
  addLicenseInteraction,
  addTaxonomyTermInteraction,
  addUserInteraction,
} from '../../__utils__/interactions'

describe('Article', () => {
  test('by alias', async () => {
    await addArticleInteraction(article)
    await addAliasInteraction(articleAlias)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${articleAlias.path}"
              }
            ) {
              __typename
              ... on Article {
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
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds'],
            article
          ),
          currentRevision: {
            id: 30674,
          },
          license: {
            id: 1,
          },
        },
      },
    })
  })

  test('by alias (w/ license)', async () => {
    await addArticleInteraction(article)
    await addAliasInteraction(articleAlias)
    await addLicenseInteraction(license)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(
            alias: {
              instance: de
              path: "${articleAlias.path}"
            }
          ) {
            __typename
            ... on Article {
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
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds'],
            article
          ),
          currentRevision: {
            id: 30674,
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
    await addArticleInteraction(article)
    await addAliasInteraction(articleAlias)
    await addArticleRevisionInteraction(articleRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${articleAlias.path}"
              }
            ) {
              __typename
              ... on Article {
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
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds'],
            article
          ),
          currentRevision: {
            id: 30674,
            title: 'title',
            content: 'content',
            changes: 'changes',
          },
        },
      },
    })
  })

  test('by alias (w/ taxonomyTerms)', async () => {
    await addArticleInteraction(article)
    await addAliasInteraction(articleAlias)
    await addTaxonomyTermInteraction(taxonomyTermSubject)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(
            alias: {
              instance: de
              path: "/mathe/funktionen/uebersicht-aller-artikel-zu-funktionen/parabel"
            }
          ) {
            __typename
            ... on Article {
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
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds'],
            article
          ),
          taxonomyTerms: [{ id: 5 }],
        },
      },
    })
  })

  test('by id', async () => {
    await addArticleInteraction(article)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 1855) {
            __typename
            ... on Article {
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
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds'],
            article
          ),
          currentRevision: {
            id: 30674,
          },
          license: {
            id: 1,
          },
        },
      },
    })
  })
})

describe('ArticleRevision', () => {
  test('by id', async () => {
    await addArticleRevisionInteraction(articleRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 30674) {
            __typename
            ... on ArticleRevision {
              id
              trashed
              date
              title
              content
              changes
              metaTitle
              metaDescription
              author {
                id
              }
              article {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          ...R.omit(['authorId', 'repositoryId'], articleRevision),
          author: {
            id: 1,
          },
          article: {
            id: 1855,
          },
        },
      },
    })
  })

  test('by id (w/ author)', async () => {
    await addArticleRevisionInteraction(articleRevision)
    await addUserInteraction(user)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 30674) {
            __typename
            ... on ArticleRevision {
              id
              trashed
              date
              title
              content
              changes
              metaTitle
              metaDescription
              author {
                id
                username
              }
              article {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          ...R.omit(['authorId', 'repositoryId'], articleRevision),
          author: {
            id: 1,
            username: user.username,
          },
          article: {
            id: 1855,
          },
        },
      },
    })
  })

  test('by id (w/ article)', async () => {
    await addArticleRevisionInteraction(articleRevision)
    await addArticleInteraction(article)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: 30674) {
            __typename
            ... on ArticleRevision {
              id
              trashed
              date
              title
              content
              changes
              metaTitle
              metaDescription
              author {
                id
              }
              article {
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
          ...R.omit(['authorId', 'repositoryId'], articleRevision),
          author: {
            id: 1,
          },
          article: {
            id: 1855,
            currentRevision: {
              id: 30674,
            },
          },
        },
      },
    })
  })
})
