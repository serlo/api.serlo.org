import gql from 'graphql-tag'

import { article, comment, user } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'
import { encodeThreadId } from '~/schema/thread/utils'

const mutation = new Client({ userId: user.id })
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
  .withInput({ id: encodeThreadId(comment.id), status: 'open' })

beforeEach(() => {
  given('UuidQuery').for(article, comment, user)
})

test('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('trashing thread returns success', async () => {
  given('ThreadSetThreadStatusMutation')
    .withPayload({ ids: [comment.id], status: 'open' })
    .returns({ success: true })

  await mutation.shouldReturnData({
    thread: { setThreadStatus: { success: true } },
  })
})
