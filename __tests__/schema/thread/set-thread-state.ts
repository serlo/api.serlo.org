import gql from 'graphql-tag'

import { comment, user } from '../../../__fixtures__'
import { Client } from '../../__utils__'
import { encodeThreadId } from '~/schema/thread/utils'

const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation setThreadState($input: ThreadSetThreadStateInput!) {
        thread {
          setThreadState(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput({ id: encodeThreadId(comment.id), trashed: true })

test('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('trashing thread returns success', async () => {
  await mutation.shouldReturnData({
    thread: { setThreadState: { success: true } },
  })
})
