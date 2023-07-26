import gql from 'graphql-tag'

import { article, comment, user } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'
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

beforeEach(() => {
  given('UuidQuery').for(article, comment, user)
})

test('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('trashing thread returns success', async () => {
  given('UuidSetStateMutation')
    .withPayload({ ids: [comment.id], userId: user.id, trashed: true })
    .returns(undefined)

  await mutation.shouldReturnData({
    thread: { setThreadState: { success: true } },
  })
})
