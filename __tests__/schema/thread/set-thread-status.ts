import gql from 'graphql-tag'

import {
  article,
  comment1,
  comment2,
  user,
  user2 as commentator,
} from '../../../__fixtures__'
import { given, Client } from '../../__utils__'
import { encodeThreadId } from '~/schema/thread/utils'

const moderator = { ...user, id: 1234, roles: ['de_moderator'] }
const threadInitiator = { ...user, id: 4321, roles: ['login'] }
const thread = { ...comment1, authorId: threadInitiator.id }
const subComment = { ...comment2, authorId: commentator.id }

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
  .withInput({ id: encodeThreadId(thread.id), status: 'open' })

beforeEach(() => {
  given('UuidQuery').for(
    article,
    thread,
    subComment,
    threadInitiator,
    commentator,
    moderator,
  )
})

test('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

describe('Authorization:', () => {
  test('thread initiators are allowed to change thread status', async () => {
    await mutation.shouldReturnData({
      thread: { setThreadStatus: { success: true } },
    })
  })

  test('commentators are allowed to change thread status', async () => {
    await mutation
      .withContext({
        userId: commentator.id,
      })
      .shouldReturnData({
        thread: { setThreadStatus: { success: true } },
      })
  })

  test('moderators are allowed to change thread status', async () => {
    await mutation
      .withContext({
        userId: moderator.id,
      })
      .shouldReturnData({
        thread: { setThreadStatus: { success: true } },
      })
  })

  test('unauthorized users get error', async () => {
    await mutation.forLoginUser().shouldFailWithError('FORBIDDEN')
  })

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
      .withVariables({ first: 1 })

    await threadQuery.shouldReturnData({
      thread: {
        allThreads: { nodes: [{ id: 'dDM1MTYz', status: 'noStatus' }] },
      },
    })

    await mutation
      .withContext({
        userId: moderator.id,
      })
      .withInput({ id: 'dDM1MTYz', status: 'done' })
      .shouldReturnData({
        thread: { setThreadStatus: { success: true } },
      })

    await threadQuery.shouldReturnData({
      thread: { allThreads: { nodes: [{ id: 'dDM1MTYz', status: 'done' }] } },
    })
  })
})
