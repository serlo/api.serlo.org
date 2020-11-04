import { gql } from 'apollo-server'

import { user } from '../../../__fixtures__/uuid'
import { comment1 } from '../../../__fixtures__/uuid/comment'
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

test('property "createdAt"', async () => {
  global.server.use(createUuidHandler(comment1))
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query propertyCreatedAt($id: Int!) {
        uuid(id: $id) {
          ... on Comment {
            createdAt
          }
        }
      }
    `,
    variables: { id: comment1.id },
    data: {
      uuid: { createdAt: comment1.date },
    },
    client,
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
    global.server.use(createUuidHandler(user))

    await assertSuccessfulGraphQLQuery({
      query,
      variables: { id: comment1.id },
      data: {
        uuid: { author: { username: user.username } },
      },
      client,
    })
  })
})
