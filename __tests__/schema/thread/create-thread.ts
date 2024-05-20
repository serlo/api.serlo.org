import gql from 'graphql-tag'

import { user } from '../../../__fixtures__'
import { Client, threadsQuery } from '../../__utils__'

const input = {
  title: 'My new thread',
  content: 'brand new!',
  objectId: 31702,
  subscribe: true,
  sendEmail: false,
}
const mutation = new Client({ userId: user.id }).prepareQuery({
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
  await threadsQuery.withVariables({ id: 31702 }).shouldReturnData({
    uuid: { threads: { nodes: [{ id: 'dDMxNzEw' }] } },
  })

  await mutation.shouldReturnData({
    thread: { createThread: { success: true } },
  })

  await threadsQuery.withVariables({ id: 31702 }).shouldReturnData({
    uuid: {
      threads: {
        nodes: [
          {
            title: input.title,
            comments: { nodes: [{ content: input.content }] },
          },
          { id: 'dDMxNzEw' },
        ],
      },
    },
  })
})

test('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})
