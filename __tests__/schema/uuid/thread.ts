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
import { rest } from 'msw'
import * as R from 'ramda'

import {
  article,
  comment1,
  comment2,
  comment3,
  getCommentDataWithoutSubresolvers,
  user,
} from '../../../__fixtures__/uuid'
import { Service } from '../../../src/graphql/schema/types'
import { UuidPayload } from '../../../src/graphql/schema/uuid/abstract-uuid'
import { CommentPayload } from '../../../src/graphql/schema/uuid/thread'
import { Instance } from '../../../src/types'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createJsonHandler,
  createTestClient,
  createUuidHandler,
} from '../../__utils__'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: user.id,
  }).client
})

test('Threads with 3 Comments', async () => {
  setupThreads(article, [[comment1, comment2], [comment3]])
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query threads($id: Int!) {
        uuid(id: $id) {
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
    `,
    variables: { id: article.id },
    data: {
      uuid: {
        threads: {
          totalCount: 2,
          nodes: [
            {
              comments: {
                totalCount: 2,
                nodes: [{ id: comment1.id }, { id: comment2.id }],
              },
            },
            { comments: { totalCount: 1, nodes: [{ id: comment3.id }] } },
          ],
        },
      },
    },
    client,
  })
})

test('Thread with 1 Comment', async () => {
  setupThreads(article, [[comment3]])
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query threads($id: Int!) {
        uuid(id: $id) {
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
    `,
    variables: { id: article.id },
    data: {
      uuid: {
        threads: {
          totalCount: 1,
          nodes: [
            {
              comments: {
                totalCount: 1,
                nodes: [{ id: comment3.id }],
              },
            },
          ],
        },
      },
    },
    client,
  })
})

test('Thread with 0 Comments', async () => {
  setupThreads(article, [])
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query threads($id: Int!) {
        uuid(id: $id) {
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
    `,
    variables: { id: article.id },
    data: { uuid: { threads: { totalCount: 0, nodes: [] } } },
    client,
  })
})

test('property "createdAt" of Thread', async () => {
  setupThreads(article, [[comment1, comment2]])
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query propertyCreatedAt($id: Int!) {
        uuid(id: $id) {
          threads {
            nodes {
              createdAt
            }
          }
        }
      }
    `,
    variables: { id: article.id },
    data: {
      uuid: { threads: { nodes: [{ createdAt: comment1.date }] } },
    },
    client,
  })
})

test('property "updatedAt" of Thread', async () => {
  setupThreads(article, [[comment1, comment2]])
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query propertyUpdatedAt($id: Int!) {
        uuid(id: $id) {
          threads {
            nodes {
              updatedAt
            }
          }
        }
      }
    `,
    variables: { id: article.id },
    data: {
      uuid: { threads: { nodes: [{ updatedAt: comment2.date }] } },
    },
    client,
  })
})

test('property "title" of Thread', async () => {
  setupThreads(article, [[comment1, comment2]])
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query propertyTitle($id: Int!) {
        uuid(id: $id) {
          threads {
            nodes {
              title
            }
          }
        }
      }
    `,
    variables: { id: article.id },
    data: {
      uuid: { threads: { nodes: [{ title: comment1.title }] } },
    },
    client,
  })
})

test('property "archived" of Thread', async () => {
  setupThreads(article, [[comment1, comment2]])
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query propertyArchived($id: Int!) {
        uuid(id: $id) {
          threads {
            nodes {
              archived
            }
          }
        }
      }
    `,
    variables: { id: article.id },
    data: {
      uuid: { threads: { nodes: [{ archived: comment1.archived }] } },
    },
    client,
  })
})

test('property "trashed" of Thread', async () => {
  setupThreads(article, [[comment1, comment2]])
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query propertyTrashed($id: Int!) {
        uuid(id: $id) {
          threads {
            nodes {
              trashed
            }
          }
        }
      }
    `,
    variables: { id: article.id },
    data: {
      uuid: { threads: { nodes: [{ trashed: comment1.trashed }] } },
    },
    client,
  })
})

test('property "object" of Thread', async () => {
  setupThreads(article, [[comment1, comment2]])
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query propertyObject($id: Int!) {
        uuid(id: $id) {
          threads {
            nodes {
              object {
                id
              }
            }
          }
        }
      }
    `,
    variables: { id: article.id },
    data: {
      uuid: { threads: { nodes: [{ object: { id: article.id } }] } },
    },
    client,
  })
})

test('endpoint /uuid/:id will not give back comment on its own', async () => {
  global.server.use(createUuidHandler(comment1))
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query comments($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on Comment {
            __typename
            trashed
            id
            content
            title
            archived
          }
        }
      }
    `,
    variables: getCommentDataWithoutSubresolvers(comment1),
    data: {
      uuid: null,
    },
    client,
  })
})

test('property "createdAt" of Comment', async () => {
  setupThreads(article, [[comment1]])
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query propertyCreatedAt($id: Int!) {
        uuid(id: $id) {
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
    `,
    variables: { id: article.id },
    data: {
      uuid: {
        threads: {
          nodes: [
            {
              comments: {
                nodes: [
                  {
                    createdAt: comment1.date,
                  },
                ],
              },
            },
          ],
        },
      },
    },
    client,
  })
})

test('Test property "author" of Comment', async () => {
  setupThreads(article, [[comment1]])
  global.server.use(createUuidHandler(user))

  await assertSuccessfulGraphQLQuery({
    query: gql`
      query propertyCreatedAt($id: Int!) {
        uuid(id: $id) {
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
    `,
    variables: { id: article.id },
    data: {
      uuid: {
        threads: {
          nodes: [
            {
              comments: {
                nodes: [
                  {
                    author: { username: user.username },
                  },
                ],
              },
            },
          ],
        },
      },
    },
    client,
  })
})

function setupThreads(uuidPayload: UuidPayload, threads: CommentPayload[][]) {
  const firstCommentIds = threads.map((thread) => thread[0].id)
  global.server.use(
    createJsonHandler({
      path: `/api/threads/${uuidPayload.id}`,
      body: { firstCommentIds },
    })
  )
  global.server.use(
    rest.get(
      `http://${Instance.De}.${process.env.SERLO_ORG_HOST}/api/uuid/:id`,
      (req, res, ctx) => {
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
      }
    )
  )
}
