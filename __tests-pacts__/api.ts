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
import { Matchers, Pact } from '@pact-foundation/pact'
import { gql } from 'apollo-server'
import * as path from 'path'
import rimraf from 'rimraf'
import * as util from 'util'

import { Client, createTestClient } from '../__tests__/utils/test-client'
import { Service } from '../src/graphql/schema/types'

const rm = util.promisify(rimraf)

const root = path.join(__dirname, '..')
const pactDir = path.join(root, 'pacts')

const pact = new Pact({
  consumer: 'api.serlo.org',
  provider: 'serlo.org',
  port: 9009,
  dir: pactDir,
})

let client: Client

beforeAll(async () => {
  await rm(pactDir)
  await pact.setup()
})

beforeEach(() => {
  client = createTestClient({ service: Service.Playground }).client
})

afterEach(async () => {
  await pact.verify()
})

afterAll(async () => {
  await pact.finalize()
})

test('License', async () => {
  await addLicenseInteraction()
  const response = await client.query({
    query: gql`
      {
        license(id: 1) {
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
    `,
  })
  expect(response.errors).toBe(undefined)
  expect(response.data).toEqual({
    license: {
      id: 1,
      instance: 'de',
      default: true,
      title: 'title',
      url: 'url',
      content: 'content',
      agreement: 'agreement',
      iconHref: 'iconHref',
    },
  })
})

describe('Uuid', () => {
  describe('Entity', () => {
    describe('Article', () => {
      test('by alias', async () => {
        await addArticleAliasInteraction()
        await addArticleUuidInteraction()
        const response = await client.query({
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
        })
        expect(response.errors).toBe(undefined)
        expect(response.data).toEqual({
          uuid: {
            __typename: 'Article',
            trashed: false,
            id: 1855,
            instance: 'de',
            date: '2014-03-01T20:45:56Z',
            currentRevision: {
              id: 30674,
            },
            license: {
              id: 1,
            },
          },
        })
      })

      test('by alias (w/ license)', async () => {
        await addArticleAliasInteraction()
        await addArticleUuidInteraction()
        await addLicenseInteraction()
        const response = await client.query({
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
        })
        expect(response.errors).toBe(undefined)
        expect(response.data).toEqual({
          uuid: {
            __typename: 'Article',
            trashed: false,
            id: 1855,
            instance: 'de',
            date: '2014-03-01T20:45:56Z',
            currentRevision: {
              id: 30674,
            },
            license: {
              id: 1,
              title: 'title',
            },
          },
        })
      })

      test('by alias (w/ currentRevision)', async () => {
        await addArticleAliasInteraction()
        await addArticleUuidInteraction()
        await addArticleRevisionInteraction()
        const response = await client.query({
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
        })
        expect(response.errors).toBe(undefined)
        expect(response.data).toEqual({
          uuid: {
            __typename: 'Article',
            trashed: false,
            id: 1855,
            instance: 'de',
            date: '2014-03-01T20:45:56Z',
            currentRevision: {
              id: 30674,
              title: 'title',
              content: 'content',
              changes: 'changes',
            },
          },
        })
      })

      test('by alias (w/ taxonomyTerms)', async () => {
        await addArticleAliasInteraction()
        await addArticleUuidInteraction()
        await addTaxonomyTermSubjectInteraction()
        const response = await client.query({
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
                  date
                  taxonomyTerms {
                    id
                  }
                }
              }
            }
          `,
        })
        expect(response.errors).toBe(undefined)
        expect(response.data).toEqual({
          uuid: {
            __typename: 'Article',
            trashed: false,
            id: 1855,
            instance: 'de',
            date: '2014-03-01T20:45:56Z',
            taxonomyTerms: [{ id: 5 }],
          },
        })
      })

      test('by id', async () => {
        await addArticleUuidInteraction()
        const response = await client.query({
          query: gql`
            {
              uuid(id: 1855) {
                __typename
                ... on Article {
                  id
                  trashed
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
        })
        expect(response.errors).toBe(undefined)
        expect(response.data).toEqual({
          uuid: {
            __typename: 'Article',
            trashed: false,
            id: 1855,
            instance: 'de',
            date: '2014-03-01T20:45:56Z',
            currentRevision: {
              id: 30674,
            },
            license: {
              id: 1,
            },
          },
        })
      })
    })
  })

  describe('EntityRevision', () => {
    describe('ArticleRevision', () => {
      test('by id', async () => {
        await addArticleRevisionInteraction()
        const response = await client.query({
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
        })
        expect(response.errors).toBe(undefined)
        expect(response.data).toEqual({
          uuid: {
            __typename: 'ArticleRevision',
            trashed: false,
            date: '2014-09-15T15:28:35Z',
            id: 30674,
            title: 'title',
            content: 'content',
            changes: 'changes',
            author: {
              id: 1,
            },
            article: {
              id: 1855,
            },
          },
        })
      })

      test('by id (w/ author)', async () => {
        await addArticleRevisionInteraction()
        await addUserInteraction()
        const response = await client.query({
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
        })
        expect(response.errors).toBe(undefined)
        expect(response.data).toEqual({
          uuid: {
            __typename: 'ArticleRevision',
            id: 30674,
            trashed: false,
            date: '2014-09-15T15:28:35Z',
            title: 'title',
            content: 'content',
            changes: 'changes',
            author: {
              id: 1,
              username: 'admin',
            },
            article: {
              id: 1855,
            },
          },
        })
      })

      test('by id (w/ article)', async () => {
        await addArticleRevisionInteraction()
        await addArticleUuidInteraction()
        const response = await client.query({
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
        })
        expect(response.errors).toBe(undefined)
        expect(response.data).toEqual({
          uuid: {
            __typename: 'ArticleRevision',
            id: 30674,
            trashed: false,
            date: '2014-09-15T15:28:35Z',
            title: 'title',
            content: 'content',
            changes: 'changes',
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
        })
      })
    })
  })

  describe('Page', () => {
    test('by alias', async () => {
      await addPageAliasInteraction()
      await addPageUuidInteraction()
      const response = await client.query({
        query: gql`
          {
            uuid(alias: { instance: de, path: "/mathe" }) {
              __typename
              ... on Page {
                id
                trashed
                currentRevision {
                  id
                }
              }
            }
          }
        `,
      })
      expect(response.errors).toBe(undefined)
      expect(response.data).toEqual({
        uuid: {
          __typename: 'Page',
          id: 19767,
          trashed: false,
          currentRevision: {
            id: 35476,
          },
        },
      })
    })

    test('by alias (w/ currentRevision)', async () => {
      await addPageAliasInteraction()
      await addPageUuidInteraction()
      await addPageRevisionInteraction()
      const response = await client.query({
        query: gql`
          {
            uuid(alias: { instance: de, path: "/mathe" }) {
              __typename
              ... on Page {
                id
                trashed
                currentRevision {
                  id
                  title
                  content
                }
              }
            }
          }
        `,
      })
      expect(response.errors).toBe(undefined)
      expect(response.data).toEqual({
        uuid: {
          __typename: 'Page',
          trashed: false,
          id: 19767,
          currentRevision: {
            id: 35476,
            title: 'title',
            content: 'content',
          },
        },
      })
    })

    test('by id', async () => {
      await addPageUuidInteraction()
      const response = await client.query({
        query: gql`
          {
            uuid(id: 19767) {
              __typename
              ... on Page {
                id
                trashed
                currentRevision {
                  id
                }
              }
            }
          }
        `,
      })
      expect(response.errors).toBe(undefined)
      expect(response.data).toEqual({
        uuid: {
          __typename: 'Page',
          trashed: false,
          id: 19767,
          currentRevision: {
            id: 35476,
          },
        },
      })
    })
  })

  describe('PageRevision', () => {
    test('by id', async () => {
      await addPageRevisionInteraction()
      const response = await client.query({
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
      })
      expect(response.errors).toBe(undefined)
      expect(response.data).toEqual({
        uuid: {
          __typename: 'PageRevision',
          trashed: false,
          id: 35476,
          title: 'title',
          content: 'content',
          date: '2015-02-28T02:06:40Z',
          author: {
            id: 1,
          },
          page: {
            id: 19767,
          },
        },
      })
    })

    test('by id (w/ author)', async () => {
      await addPageRevisionInteraction()
      await addUserInteraction()
      const response = await client.query({
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
      })
      expect(response.errors).toBe(undefined)
      expect(response.data).toEqual({
        uuid: {
          __typename: 'PageRevision',
          trashed: false,
          id: 35476,
          title: 'title',
          date: '2015-02-28T02:06:40Z',
          content: 'content',
          author: { id: 1, username: 'admin' },
          page: {
            id: 19767,
          },
        },
      })
    })

    test('by id (w/ page)', async () => {
      await addPageRevisionInteraction()
      await addPageUuidInteraction()
      const response = await client.query({
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
      })
      expect(response.errors).toBe(undefined)
      expect(response.data).toEqual({
        uuid: {
          __typename: 'PageRevision',
          trashed: false,
          id: 35476,
          title: 'title',
          date: '2015-02-28T02:06:40Z',
          content: 'content',
          author: { id: 1 },
          page: {
            id: 19767,
            currentRevision: { id: 35476 },
          },
        },
      })
    })
  })

  describe('User', () => {
    test('by id', async () => {
      await addUserInteraction()
      const response = await client.query({
        query: gql`
          {
            uuid(id: 1) {
              __typename
              ... on User {
                id
                trashed
                username
                date
                lastLogin
                description
              }
            }
          }
        `,
      })
      expect(response.errors).toBe(undefined)
      expect(response.data).toEqual({
        uuid: {
          __typename: 'User',
          trashed: false,
          id: 1,
          username: 'admin',
          date: '2014-03-01T20:36:21Z',
          lastLogin: '2020-03-24T09:40:55Z',
          description: null,
        },
      })
    })
  })
  describe('TaxonomyTerm', () => {
    test('by id (subject)', async () => {
      await addTaxonomyTermCurriculumTopicInteraction()
      await addTaxonomyTermSubjectInteraction()
      const response = await client.query({
        query: gql`
          {
            uuid(id: 5) {
              __typename
              ... on TaxonomyTerm {
                id
                type
                trashed
                instance
                name
                description
                weight

                parent {
                  id
                }

                children {
                  id
                }
              }
            }
          }
        `,
      })
      expect(response.errors).toBe(undefined)
      expect(response.data).toEqual({
        uuid: {
          __typename: 'TaxonomyTerm',
          type: 'subject',
          trashed: false,
          id: 5,
          instance: 'de',
          name: 'mathe',
          description: null,
          weight: 16,
          parent: {
            id: 3,
          },
          children: [
            {
              id: 16048,
            },
          ],
        },
      })
    })

    test('by id (subject, w/ path)', async () => {
      await addTaxonomyTermRootInteraction()
      await addTaxonomyTermCurriculumTopicInteraction()
      await addTaxonomyTermSubjectInteraction()
      const response = await client.query({
        query: gql`
          {
            uuid(id: 5) {
              __typename
              ... on TaxonomyTerm {
                id
                type
                trashed
                instance
                name
                description
                weight

                parent {
                  id
                }

                children {
                  id
                }

                path {
                  id
                }
              }
            }
          }
        `,
      })
      expect(response.errors).toBe(undefined)
      expect(response.data).toEqual({
        uuid: {
          __typename: 'TaxonomyTerm',
          type: 'subject',
          trashed: false,
          id: 5,
          instance: 'de',
          name: 'mathe',
          description: null,
          weight: 16,

          parent: {
            id: 3,
          },

          children: [
            {
              id: 16048,
            },
          ],

          path: [{ id: 3 }, { id: 5 }],
        },
      })
    })

    test('by id (curriculum-topic)', async () => {
      await addTaxonomyTermCurriculumTopicInteraction()
      const response = await client.query({
        query: gql`
          {
            uuid(id: 16048) {
              __typename
              ... on TaxonomyTerm {
                id
                type
                trashed
                instance
                name
                description
                weight
              }
            }
          }
        `,
      })
      expect(response.errors).toBe(undefined)
      expect(response.data).toEqual({
        uuid: {
          __typename: 'TaxonomyTerm',
          type: 'curriculumTopic',
          trashed: false,
          id: 16048,
          instance: 'de',
          name: 'Natürliche Zahlen',
          description: 'description',
          weight: 1,
        },
      })
    })
  })
})

function addLicenseInteraction() {
  return pact.addInteraction({
    state: `1 is a license`,
    uponReceiving: `resolve license 1`,
    withRequest: {
      method: 'GET',
      path: '/api/license/1',
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: {
        id: 1,
        instance: Matchers.string('de'),
        default: Matchers.boolean(true),
        title: Matchers.string('title'),
        url: Matchers.string('url'),
        content: Matchers.string('content'),
        agreement: Matchers.string('agreement'),
        iconHref: Matchers.string('iconHref'),
      },
    },
  })
}

function addArticleAliasInteraction() {
  return addAliasInteraction({
    request: '/mathe/funktionen/uebersicht-aller-artikel-zu-funktionen/parabel',
    response: {
      id: 1855,
      source: '/entity/view/1855',
      timestamp: Matchers.iso8601DateTime('2014-06-16T15:58:45Z'),
    },
  })
}

function addArticleUuidInteraction() {
  return addUuidInteraction({
    request: 1855,
    response: {
      id: 1855,
      trashed: Matchers.boolean(false),
      discriminator: 'entity',
      type: 'article',
      instance: 'de',
      date: Matchers.iso8601DateTime('2014-03-01T20:45:56Z'),
      currentRevisionId: 30674,
      licenseId: 1,
      taxonomyTermIds: Matchers.eachLike(Matchers.integer(5)),
    },
  })
}

function addArticleRevisionInteraction() {
  return addUuidInteraction({
    request: 30674,
    response: {
      id: 30674,
      trashed: Matchers.boolean(false),
      discriminator: 'entityRevision',
      date: Matchers.iso8601DateTime('2014-09-15T15:28:35Z'),
      type: 'article',
      authorId: Matchers.integer(1),
      repositoryId: 1855,
      title: Matchers.string('title'),
      content: Matchers.string('content'),
      changes: Matchers.string('changes'),
    },
  })
}

function addPageAliasInteraction() {
  return addAliasInteraction({
    request: '/mathe',
    response: {
      id: 19767,
      source: '/page/view/19767',
      timestamp: Matchers.iso8601DateTime('2014-05-25T10:25:44Z'),
    },
  })
}

function addPageUuidInteraction() {
  return addUuidInteraction({
    request: 19767,
    response: {
      id: 19767,
      trashed: Matchers.boolean(false),
      discriminator: 'page',
      currentRevisionId: Matchers.integer(35476),
    },
  })
}

function addPageRevisionInteraction() {
  return addUuidInteraction({
    request: 35476,
    response: {
      id: 35476,
      trashed: Matchers.boolean(false),
      discriminator: 'pageRevision',
      title: Matchers.string('title'),
      content: Matchers.string('content'),
      date: Matchers.iso8601DateTime('2015-02-28T02:06:40Z'),
      authorId: Matchers.integer(1),
      repositoryId: 19767,
    },
  })
}

function addUserInteraction() {
  return addUuidInteraction({
    request: 1,
    response: {
      id: 1,
      trashed: Matchers.boolean(false),
      discriminator: 'user',
      username: Matchers.string('admin'),
      date: Matchers.iso8601DateTime('2014-03-01T20:36:21Z'),
      lastLogin: Matchers.iso8601DateTime('2020-03-24T09:40:55Z'),
      description: null,
    },
  })
}

async function addTaxonomyTermRootInteraction() {
  return addUuidInteraction({
    request: 3,
    response: {
      id: 3,
      trashed: Matchers.boolean(false),
      discriminator: 'taxonomyTerm',
      type: 'root',
      instance: 'de',
      name: Matchers.string('Root'),
      description: null,
      weight: Matchers.integer(1),
      parentId: null,
      childrenIds: Matchers.eachLike(Matchers.integer(5)),
    },
  })
}

async function addTaxonomyTermSubjectInteraction() {
  return addUuidInteraction({
    request: 5,
    response: {
      id: 5,
      trashed: Matchers.boolean(false),
      discriminator: 'taxonomyTerm',
      type: 'subject',
      instance: 'de',
      name: Matchers.string('mathe'),
      description: null,
      weight: Matchers.integer(16),
      parentId: 3,
      childrenIds: Matchers.eachLike(Matchers.integer(16048)),
    },
  })
}

function addTaxonomyTermCurriculumTopicInteraction() {
  return addUuidInteraction({
    request: 16048,
    response: {
      id: 16048,
      trashed: Matchers.boolean(false),
      discriminator: 'taxonomyTerm',
      type: 'curriculum-topic',
      instance: 'de',
      name: Matchers.string('Natürliche Zahlen'),
      description: Matchers.string('description'),
      weight: Matchers.integer(1),
      parentId: 16043,
      childrenIds: Matchers.eachLike(1855),
    },
  })
}

async function addAliasInteraction<
  T extends { id: number; source: string }
>(payload: { request: string; response: T }) {
  const { request, response } = payload
  await pact.addInteraction({
    state: `${request} is alias of ${response.source} in instance de`,
    uponReceiving: `resolve de.serlo.org${request}`,
    withRequest: {
      method: 'GET',
      path: `/api/alias${request}`,
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: response,
    },
  })
}

async function addUuidInteraction<
  T extends { discriminator: string; id: number }
>(payload: { request: number; response: T }) {
  const { request, response } = payload
  await pact.addInteraction({
    state: `uuid ${request} is of discriminator ${response.discriminator}`,
    uponReceiving: `resolve uuid ${request}`,
    withRequest: {
      method: 'GET',
      path: `/api/uuid/${request}`,
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: response,
    },
  })
}
