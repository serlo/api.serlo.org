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
import * as R from 'ramda'

import {
  article,
  comment,
  comment1,
  comment2,
  comment3,
  user,
} from '../../../__fixtures__'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
  Client,
  createAliasHandler,
  createJsonHandler,
  createTestClient,
  createUuidHandler,
} from '../../__utils__'
import { Service } from '~/internals/auth'
import { CommentPayload, UuidPayload } from '~/schema/uuid'
import { encodeThreadId } from '~/schema/uuid/thread/utils'
import { Instance, ThreadCreateThreadInput } from '~/types'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.SerloCloudflareWorker,
    userId: user.id,
  })
})
describe('uuid["threads"]', () => {
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

  test('property "title" of Thread can be null', async () => {
    setupThreads(article, [[{ ...comment1, title: null }]])
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
        uuid: { threads: { nodes: [{ title: null }] } },
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
})

describe('createThread', () => {
  test('successful mutation returns thread', async () => {
    setupComments(article.id, comment1.date)

    await assertSuccessfulGraphQLMutation({
      ...createCreateThreadMutation({
        title: 'First comment in new thread',
        content: 'first!',
        objectId: article.id,
      }),
      client,
      data: {
        thread: {
          createThread: {
            success: true,
            record: {
              archived: false,
              comments: {
                nodes: [
                  {
                    content: 'first!',
                  },
                ],
              },
            },
          },
        },
      },
    })
  })

  test('unauthenticated user gets error', async () => {
    const client = createTestClient({ userId: null })

    await assertFailingGraphQLMutation(
      {
        ...createCreateThreadMutation({
          title: 'New comment',
          content: 'Content of new comment',
          objectId: article.id,
        }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('UNAUTHENTICATED')
      }
    )
  })

  function createCreateThreadMutation(variables: ThreadCreateThreadInput) {
    return {
      mutation: gql`
        mutation createThread($input: ThreadCreateThreadInput!) {
          thread {
            createThread(input: $input) {
              success
              record {
                archived
                comments {
                  nodes {
                    content
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        input: variables,
      },
    }
  }
})

describe('setThreadState', () => {
  const mutation = gql`
    mutation setThreadState($input: ThreadSetThreadStateInput!) {
      thread {
        setThreadState(input: $input) {
          success
        }
      }
    }
  `
  beforeEach(() =>
    global.server.use(
      rest.post(
        `http://de.${process.env.SERLO_ORG_HOST}/api/set-uuid-state/:id`,
        (req, res, ctx) => {
          const { userId, trashed } = req.body as {
            userId: number
            trashed: boolean
          }
          const id = parseInt(req.params.id)

          if (userId !== user.id) return res(ctx.status(403))

          //TODO: how does the endpoint return here actually? 404 or null?
          // if (![1, 2, 3].includes(id)) return res(ctx.status(404))
          if (![1, 2, 3].includes(id)) return res(ctx.json(null))

          return res(ctx.json({ ...comment, trashed: trashed }))
        }
      )
    )
  )
  test('deleting thread returns success', async () => {
    await assertSuccessfulGraphQLMutation({
      mutation,
      client,
      variables: {
        input: { id: encodeThreadId(1), trashed: true },
      },
      data: {
        thread: {
          setThreadState: {
            success: true,
          },
        },
      },
    })
  })

  test('mutation returns success: false on non existing id', async () => {
    await assertSuccessfulGraphQLMutation({
      mutation,
      client,
      variables: {
        input: { id: encodeThreadId(4), trashed: true },
      },
      data: {
        thread: {
          setThreadState: {
            success: false,
          },
        },
      },
    })
  })

  test('unauthenticated user gets error', async () => {
    const client = createTestClient({ userId: null })
    await assertFailingGraphQLMutation(
      {
        mutation,
        variables: {
          input: {
            id: encodeThreadId(1),
            trashed: true,
          },
        },
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('UNAUTHENTICATED')
      }
    )
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

function setupComments(id: number, date: string) {
  global.server.use(
    rest.post<ThreadCreateThreadInput & { userId: number }>(
      `http://de.${process.env.SERLO_ORG_HOST}/api/add-comment`,
      (req, res, ctx) => {
        if (typeof req.body === 'string' || typeof req.body === 'undefined')
          return res(ctx.status(400))
        return res(
          ctx.json({
            id,
            title: req.body.title,
            trashed: false,
            alias: null,
            __typename: 'Comment',
            authorId: req.body.userId,
            date,
            archived: false,
            content: req.body.content,
            parentId: req.body.objectId,
            childrenIds: [],
          })
        )
      }
    )
  )
}
