import { gql } from 'apollo-server'

import { user } from '../../../__fixtures__/uuid'
import {
  comment1,
  getCommentDataWithoutSubresolvers,
} from '../../../__fixtures__/uuid/comment'
import { Service } from '../../../src/graphql/schema/types'
import {
  assertSuccessfulGraphQLQuery,
  Client,
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

test('Comment', async () => {
  global.server.use(createUuidHandler(comment1))
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query comment($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on Comment {
            alias
            archived
            title
            content
            id
            trashed
            parentId
            childrenIds
          }
        }
      }
    `,
    variables: { id: comment1.id },
    data: {
      uuid: getCommentDataWithoutSubresolvers(comment1),
    },
    client,
  })
})

describe('property "createdAt"', () => {
  const query = gql`
    query propertyCreatedAt($id: Int!) {
      uuid(id: $id) {
        ... on Comment {
          createdAt
        }
      }
    }
  `

  test('Test property "createdAt"', async () => {
    global.server.use(createUuidHandler(comment1))

    await assertSuccessfulGraphQLQuery({
      query,
      variables: { id: comment1.id },
      data: {
        uuid: { createdAt: '2015-07-07T09:00:31+02:00' },
      },
      client,
    })
  })
})

describe('property "author"', () => {
  const query = gql`
    query propertyCreatedAt($id: Int!) {
      uuid(id: $id) {
        ... on Comment {
          author {
            username
          }
        }
      }
    }
  `
  test('Test property "author"', async () => {
    global.server.use(createUuidHandler(comment1))

    await assertSuccessfulGraphQLQuery({
      query,
      variables: { id: comment1.id },
      data: {
        uuid: { author: 1 },
      },
      client,
    })
  })
})
