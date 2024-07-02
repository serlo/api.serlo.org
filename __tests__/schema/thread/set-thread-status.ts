import gql from 'graphql-tag'

import { Client, entityQuery } from '../../__utils__'
import { encodeThreadId } from '~/schema/thread/utils'

const input = { id: encodeThreadId(34161), status: 'done' }
const mutation = new Client({ userId: 1 }).prepareQuery({
  query: gql`
    mutation setThreadStatus($input: ThreadSetThreadStatusInput!) {
      thread {
        setThreadStatus(input: $input) {
          success
        }
      }
    }
  `,
  variables: { input },
})

test('changes status of thread', async function () {
  await entityQuery.withVariables({ id: 34159 }).shouldReturnData({
    uuid: { threads: { nodes: [{ status: 'noStatus' }] } },
  })

  await mutation.shouldReturnData({
    thread: { setThreadStatus: { success: true } },
  })

  await entityQuery.withVariables({ id: 34159 }).shouldReturnData({
    uuid: { threads: { nodes: [{ status: 'done' }] } },
  })
})

test('thread initiators are allowed to change thread status', async () => {
  await mutation.shouldReturnData({
    thread: { setThreadStatus: { success: true } },
  })
})

test('commentators are allowed to change thread status', async () => {
  await mutation.withContext({ userId: 32543 }).shouldReturnData({
    thread: { setThreadStatus: { success: true } },
  })
})

test('moderators are allowed to change thread status', async () => {
  const newMutation = await mutation.forUser('de_moderator')
  await newMutation.shouldReturnData({
    thread: { setThreadStatus: { success: true } },
  })
})

test('unauthorized users get error', async () => {
  await mutation.forLoginUser().shouldFailWithError('FORBIDDEN')
})

test('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})
