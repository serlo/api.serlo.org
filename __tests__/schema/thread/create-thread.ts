import gql from 'graphql-tag'

import { Client, subscriptionsQuery, threadsQuery } from '../../__utils__'

const input = {
  title: 'My new thread',
  content: 'brand new!',
  objectId: 28009,
  subscribe: true,
  sendEmail: false,
}
const mutation = new Client({ userId: 15491 }).prepareQuery({
  query: gql`
    mutation createThread($input: ThreadCreateThreadInput!) {
      thread {
        createThread(input: $input) {
          success
        }
      }
    }
  `,
  variables: { input },
})

test('should create a new thread', async () => {
  await threadsQuery.withVariables({ id: input.objectId }).shouldReturnData({
    uuid: { threads: { nodes: [{ id: 'dDMwMzIy' }] } },
  })

  await subscriptionsQuery.withContext({ userId: 15491 }).shouldReturnData({
    subscription: { getSubscriptions: { nodes: [] } },
  })

  await mutation.shouldReturnData({
    thread: { createThread: { success: true } },
  })

  await threadsQuery.withVariables({ id: input.objectId }).shouldReturnData({
    uuid: {
      threads: {
        nodes: [
          {
            title: input.title,
            comments: { nodes: [{ content: input.content }] },
          },
          { id: 'dDMwMzIy' },
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
