import { gql } from 'apollo-server'
import * as R from 'ramda'

import { license } from '../../__fixtures__/license'
import {
  article,
  articleAlias,
  articleRevision,
  taxonomyTermSubject,
  user,
} from '../../__fixtures__/uuid'
import { assertSuccessfulGraphQLQuery } from '../__utils__/assertions'
import {
  addAliasInteraction,
  addArticleInteraction,
  addArticleRevisionInteraction,
  addLicenseInteraction,
  addTaxonomyTermInteraction,
  addUserInteraction,
} from '../__utils__/interactions'

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
          __typename: 'Article',
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
          __typename: 'Article',
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
          __typename: 'Article',
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
          __typename: 'Article',
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
          __typename: 'Article',
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
          __typename: 'ArticleRevision',
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
          __typename: 'ArticleRevision',
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
          __typename: 'ArticleRevision',
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
