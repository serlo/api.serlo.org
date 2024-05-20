import gql from 'graphql-tag'

import { Client, subscriptionsQuery, threadsQuery } from '../../__utils__'

const input = {
  content: 'Hello',
  threadId: 'dDMwMTc3',
  subscribe: true,
  sendEmail: false,
}

const mutation = new Client({ userId: 15491 }).prepareQuery({
  query: gql`
    mutation ($input: ThreadCreateCommentInput!) {
      thread {
        createComment(input: $input) {
          success
        }
      }
    }
  `,
  variables: { input },
})

test('comment gets created', async () => {
  await threadsQuery.withVariables({ id: 29921 }).shouldReturnData({
    uuid: {
      threads: {
        nodes: [{ id: input.threadId, comments: { nodes: [{ id: 30177 }] } }],
      },
    },
  })

  await subscriptionsQuery.withContext({ userId: 15491 }).shouldReturnData({
    subscription: { getSubscriptions: { nodes: [] } },
  })

  await mutation.shouldReturnData({
    thread: { createComment: { success: true } },
  })

  await threadsQuery.withVariables({ id: 29921 }).shouldReturnData({
    uuid: {
      threads: {
        nodes: [
          {
            id: input.threadId,
            comments: { nodes: [{ id: 30177 }, { content: input.content }] },
          },
        ],
      },
    },
  })

  await subscriptionsQuery.withContext({ userId: 15491 }).shouldReturnData({
    subscription: {
      getSubscriptions: {
        nodes: [
          { object: { id: expect.any(Number) as number }, sendEmail: false },
        ],
      },
    },
  })
})

test('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})
