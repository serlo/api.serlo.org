import gql from 'graphql-tag'

import { user } from '../../../__fixtures__'
import { Client } from '../../__utils__'
import { encodeThreadId } from '~/schema/thread/utils'

const moderator = { ...user, id: 10, roles: ['de_moderator'] }
const threadInitiator = { ...user, id: 1194, roles: ['login'] }

const mutation = new Client({ userId: threadInitiator.id })
  .prepareQuery({
    query: gql`
      mutation setThreadStatus($input: ThreadSetThreadStatusInput!) {
        thread {
          setThreadStatus(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput({ id: encodeThreadId(35163), status: 'open' })

test('status is actually changed', async function () {
  const threadQuery = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        query (
          $first: Int
          $after: String
          $instance: Instance
          $subjectId: String
          $status: CommentStatus
        ) {
          thread {
            allThreads(
              first: $first
              after: $after
              instance: $instance
              subjectId: $subjectId
              status: $status
            ) {
              nodes {
                id
                status
              }
            }
          }
        }
      `,
    })
    .withVariables({ first: 3 })

  const queryResult = await threadQuery.getData()
  const data = queryResult as {
    thread: {
      allThreads: {
        nodes: Array<{ id: string; status: string }>
      }
    }
  }

  const threadIDs = data.thread.allThreads.nodes.map((node) => {
    expect(node.status).toBe('noStatus')
    return node.id
  })

  await mutation
    .withContext({ userId: moderator.id })
    .withInput({ id: threadIDs, status: 'done' })
    .shouldReturnData({
      thread: { setThreadStatus: { success: true } },
    })

  await threadQuery.shouldReturnData({
    thread: {
      allThreads: {
        nodes: threadIDs.map((id) => ({ id, status: 'done' })),
      },
    },
  })
})

test('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('thread initiators are allowed to change thread status', async () => {
  await mutation.shouldReturnData({
    thread: { setThreadStatus: { success: true } },
  })
})

test('commentators are allowed to change thread status', async () => {
  const commentatorId = 266
  // Let's remove all other roles of this user to be sure that they will change status although they are just login user
  await global.databaseForTests.mutate(
    'DELETE FROM role_user WHERE user_id = ? AND role_id > 2',
    [commentatorId],
  )
  await mutation.withContext({ userId: commentatorId }).shouldReturnData({
    thread: { setThreadStatus: { success: true } },
  })
})

test('moderators are allowed to change thread status', async () => {
  await mutation.withContext({ userId: moderator.id }).shouldReturnData({
    thread: { setThreadStatus: { success: true } },
  })
})

test('unauthorized users get error', async () => {
  await mutation.forLoginUser().shouldFailWithError('FORBIDDEN')
})