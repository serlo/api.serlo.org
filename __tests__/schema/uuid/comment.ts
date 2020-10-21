import { gql } from 'apollo-server'

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
import { user } from '../../../__fixtures__/uuid'

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
        }
      }
    `,
    variables: comment1,
    data: {
      uuid: getCommentDataWithoutSubresolvers(comment1),
    },
    client,
  })
})
