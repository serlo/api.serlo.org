import { gql } from 'apollo-server'
import { rest } from 'msw'

import { article, user } from '../../__fixtures__/uuid'
import { comment1, comment2, comment3 } from '../../__fixtures__/uuid/comment'
import { Service } from '../../src/graphql/schema/types'
import { UuidPayload } from '../../src/graphql/schema/uuid/abstract-uuid'
import { CommentPayload } from '../../src/graphql/schema/uuid/comment'
import { Instance } from '../../src/types'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createTestClient,
  createThreadsHandler,
} from '../__utils__'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: user.id,
  }).client
})

// This test does not make sense
test('Threads', async () => {
  setupThreads(article, [[comment1, comment2], [comment3]])
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query uuid($id: Int!) {
        uuid(id: $id) {
          __typename
          #threads {
          #totalCount
          #nodes {
          #createdAt
          #updatedAt
          #title
          #archived
          #trashed
          #}
          #}
        }
      }
    `,
    variables: { id: article.id },
    data: {
      uuid: article,
    },
    client,
  })
})

function setupThreads(uuidPayload: UuidPayload, threads: CommentPayload[][]) {
  global.server.use(
    createThreadsHandler(
      uuidPayload.id,
      threads.map((thread) => thread[0].id)
    )
  )
  global.server.use(
    rest.get(
      `http://${Instance.De}.${process.env.SERLO_ORG_HOST}/api/uuid/${uuidPayload.id}`,
      (req, res, ctx) => {
        //Findet keine Id hier!!
        const id = Number(req.params.id)
        const thread = threads.find((thread) =>
          thread.find((comment) => comment.id === id)
        )
        if (thread === null || thread === undefined) {
          return res(ctx.status(404))
        }
        const comment = thread.find((comment) => comment.id === id)
        if (comment === null || comment === undefined) {
          return res(ctx.status(404))
        }
        let payload = {}
        if (comment.id === thread[0].id) {
          payload = {
            ...comment,
            parentId: uuidPayload,
            childrenIds: thread.slice(1).map((c) => c.id),
          }
        }
        return res(ctx.json(payload))
      }
    )
  )
}
