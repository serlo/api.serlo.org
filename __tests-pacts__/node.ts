import { gql } from 'apollo-server'
import * as R from 'ramda'

import { thread } from '../__fixtures__/threads'
import { user } from '../__fixtures__/uuid'
import { UuidType } from '../src/graphql/schema/uuid'
import { assertSuccessfulGraphQLQuery } from './__utils__/assertions'
import { addThreadInteraction } from './__utils__/comments-interactions'
import { addUserInteraction } from './__utils__/interactions'
import { addUuidInteraction } from './__utils__/uuid-interaction'

test('User (by id)', async () => {
  await addUserInteraction(user)
  await assertSuccessfulGraphQLQuery({
    query: gql`
      {
        node(id: "${user.id}") {
          ... on User {
            id
          }
        }
      }
    `,
    data: {
      node: {
        id: user.id,
      },
    },
  })
})

test('Thread (by id)', async () => {
  await addUuidInteraction({
    id: thread.id,
    type: UuidType.Thread,
  })
  await addThreadInteraction(1, thread)
  await assertSuccessfulGraphQLQuery({
    query: gql`
      {
        node(id: "${thread.id}") {
          ... on Thread {
            id
            title
            archived
            createdAt
            updatedAt
          }
        }
      }
    `,
    data: {
      node: R.omit(['commentIds'], thread),
    },
  })
})
