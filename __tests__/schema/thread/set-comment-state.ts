import { gql } from 'apollo-server'

import { article, comment, user } from '../../../__fixtures__'
import { Client, given } from '../../__utils__'

const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation setCommentState($input: ThreadSetCommentStateInput!) {
        thread {
          setCommentState(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput({ id: comment.id, trashed: true })

beforeEach(() => {
  given('UuidQuery').for(article, comment, user)
})

// TODO: this is actually wrong since the provided comment is a thread
test('trashing comment returns success', async () => {
  given('UuidSetStateMutation')
    .withPayload({ ids: [comment.id], userId: user.id, trashed: true })
    .returns(undefined)

  await mutation.shouldReturnData({
    thread: { setCommentState: { success: true } },
  })
})

test('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})
