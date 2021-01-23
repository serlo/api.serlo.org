/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'
import { rest } from 'msw'
import R from 'ramda'

import {
  article,
  comment,
  comment1,
  comment2,
  comment3,
  user,
} from '../../../__fixtures__'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createAliasHandler,
  createJsonHandlerForDatabaseLayer,
  createTestClient,
  createUuidHandler,
  getDatabaseLayerUrl,
} from '../../__utils__'
import { CommentPayload, UuidPayload } from '~/schema/uuid'
import { Instance } from '~/types'

let client: Client

beforeEach(() => {
  client = createTestClient({ userId: user.id })
})

describe('uuid["threads"]', () => {
  test('Threads with 3 Comments', async () => {
    mockEndpointsForThreads(article, [[comment1, comment2], [comment3]])
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query threads($id: Int!) {
          uuid(id: $id) {
            ... on ThreadAware {
              threads {
                totalCount
                nodes {
                  comments {
                    totalCount
                    nodes {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: { id: article.id },
      data: {
        uuid: {
          threads: {
            totalCount: 2,
            nodes: [
              { comments: { totalCount: 1, nodes: [{ id: comment3.id }] } },
              {
                comments: {
                  totalCount: 2,
                  nodes: [{ id: comment1.id }, { id: comment2.id }],
                },
              },
            ],
          },
        },
      },
      client,
    })
  })

  test('Thread with 1 Comment', async () => {
    mockEndpointsForThreads(article, [[comment3]])
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query threads($id: Int!) {
          uuid(id: $id) {
            ... on ThreadAware {
              threads {
                totalCount
                nodes {
                  comments {
                    totalCount
                    nodes {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: { id: article.id },
      data: {
        uuid: {
          threads: {
            totalCount: 1,
            nodes: [
              { comments: { totalCount: 1, nodes: [{ id: comment3.id }] } },
            ],
          },
        },
      },
      client,
    })
  })

  test('Thread with 0 Comments', async () => {
    mockEndpointsForThreads(article, [])
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query threads($id: Int!) {
          uuid(id: $id) {
            ... on ThreadAware {
              threads {
                totalCount
                nodes {
                  comments {
                    totalCount
                    nodes {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: { id: article.id },
      data: { uuid: { threads: { totalCount: 0, nodes: [] } } },
      client,
    })
  })

  test('property "createdAt" of Thread', async () => {
    mockEndpointsForThreads(article, [[comment1, comment2]])
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query propertyCreatedAt($id: Int!) {
          uuid(id: $id) {
            ... on ThreadAware {
              threads {
                nodes {
                  createdAt
                }
              }
            }
          }
        }
      `,
      variables: { id: article.id },
      data: { uuid: { threads: { nodes: [{ createdAt: comment1.date }] } } },
      client,
    })
  })

  test('property "title" of Thread', async () => {
    mockEndpointsForThreads(article, [[comment1, comment2]])
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query propertyTitle($id: Int!) {
          uuid(id: $id) {
            ... on ThreadAware {
              threads {
                nodes {
                  title
                }
              }
            }
          }
        }
      `,
      variables: { id: article.id },
      data: { uuid: { threads: { nodes: [{ title: comment1.title }] } } },
      client,
    })
  })

  test('property "title" of Thread can be null', async () => {
    mockEndpointsForThreads(article, [[{ ...comment1, title: null }]])
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query propertyTitle($id: Int!) {
          uuid(id: $id) {
            ... on ThreadAware {
              threads {
                nodes {
                  title
                }
              }
            }
          }
        }
      `,
      variables: { id: article.id },
      data: { uuid: { threads: { nodes: [{ title: null }] } } },
      client,
    })
  })

  test('property "id" of Thread', async () => {
    mockEndpointsForThreads(article, [[comment1, comment2]])
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query propertyArchived($id: Int!) {
          uuid(id: $id) {
            ... on ThreadAware {
              threads {
                nodes {
                  id
                }
              }
            }
          }
        }
      `,
      variables: { id: article.id },
      data: {
        uuid: { threads: { nodes: [{ id: expect.any(String) as string }] } },
      },
      client,
    })
  })

  test('property "archived" of Thread', async () => {
    mockEndpointsForThreads(article, [[comment1, comment2]])
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query propertyArchived($id: Int!) {
          uuid(id: $id) {
            ... on ThreadAware {
              threads {
                nodes {
                  archived
                }
              }
            }
          }
        }
      `,
      variables: { id: article.id },
      data: { uuid: { threads: { nodes: [{ archived: false }] } } },
      client,
    })
  })

  test('property "object" of Thread', async () => {
    mockEndpointsForThreads(article, [[comment1, comment2]])
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query propertyObject($id: Int!) {
          uuid(id: $id) {
            ... on ThreadAware {
              threads {
                nodes {
                  object {
                    id
                  }
                }
              }
            }
          }
        }
      `,
      variables: { id: article.id },
      data: { uuid: { threads: { nodes: [{ object: { id: article.id } }] } } },
      client,
    })
  })

  describe('endpoint uuid() will not give back comment on its own', () => {
    test('when requested via id', async () => {
      global.server.use(createUuidHandler(comment1))
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query comments($id: Int!) {
            uuid(id: $id) {
              __typename
            }
          }
        `,
        variables: { id: comment1.id },
        data: { uuid: null },
        client,
      })
    })

    test('when requested via alias', async () => {
      const aliasInput = { path: comment.alias ?? '', instance: Instance.De }
      global.server.use(createUuidHandler(comment))
      global.server.use(createAliasHandler({ ...aliasInput, id: comment.id }))

      await assertSuccessfulGraphQLQuery({
        query: gql`
          query comments($alias: AliasInput!) {
            uuid(alias: $alias) {
              __typename
            }
          }
        `,
        variables: { alias: aliasInput },
        data: { uuid: null },
        client,
      })
    })
  })

  test('property "createdAt" of Comment', async () => {
    mockEndpointsForThreads(article, [[comment1]])
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query propertyCreatedAt($id: Int!) {
          uuid(id: $id) {
            ... on ThreadAware {
              threads {
                nodes {
                  comments {
                    nodes {
                      createdAt
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: { id: article.id },
      data: {
        uuid: {
          threads: {
            nodes: [{ comments: { nodes: [{ createdAt: comment1.date }] } }],
          },
        },
      },
      client,
    })
  })

  test('Test property "author" of Comment', async () => {
    mockEndpointsForThreads(article, [[comment1]])
    global.server.use(createUuidHandler(user))

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query propertyCreatedAt($id: Int!) {
          uuid(id: $id) {
            ... on ThreadAware {
              threads {
                nodes {
                  comments {
                    nodes {
                      author {
                        username
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: { id: article.id },
      data: {
        uuid: {
          threads: {
            nodes: [
              {
                comments: { nodes: [{ author: { username: user.username } }] },
              },
            ],
          },
        },
      },
      client,
    })
  })
})

export function mockEndpointsForThreads(
  uuidPayload: UuidPayload,
  threads: CommentPayload[][]
) {
  const firstCommentIds = threads.map((thread) => thread[0].id)

  global.server.use(
    createJsonHandlerForDatabaseLayer({
      path: `/threads/${uuidPayload.id}`,
      body: { firstCommentIds },
    })
  )
  global.server.use(
    rest.get(getDatabaseLayerUrl({ path: '/uuid/:id' }), (req, res, ctx) => {
      const id = Number(req.params.id)

      if (id === uuidPayload.id) return res(ctx.json(uuidPayload))

      const thread = threads.find((thread) =>
        thread.some((comment) => comment.id === id)
      )

      if (R.isNil(thread)) return res(ctx.status(404))

      const comment = thread.find((comment) => comment.id === id)

      if (R.isNil(comment)) return res(ctx.status(404))

      const payload =
        comment.id === thread[0].id
          ? {
              ...comment,
              parentId: uuidPayload.id,
              childrenIds: thread.slice(1).map((comment) => comment.id),
            }
          : {
              ...comment,
              parentId: thread[0].id,
              childrenIds: [],
            }

      return res(ctx.json(payload))
    })
  )
}
