import gql from 'graphql-tag'

import { comment, comment2, comment3, user, user2 } from '../../../__fixtures__'
import { Client } from '../../__utils__'

const mutation = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    mutation setCommentState($input: ThreadSetCommentStateInput!) {
      thread {
        setCommentState(input: $input) {
          success
        }
      }
    }
  `,
  variables: { input: { id: 35182, trashed: true } },
})

// TODO: this is actually wrong since the provided comment is a thread
test('trashing any comment as a moderator returns success', async () => {
  await mutation.shouldReturnData({
    thread: { setCommentState: { success: true } },
  })
})

test('trashing own comment returns success', async () => {
  await mutation.withContext({ userId: 266 }).shouldReturnData({
    thread: { setCommentState: { success: true } },
  })
})

test('trashing the comment from another user returns an error', async () => {
  await mutation
    .withContext({ userId: user2.id })
    .withInput({ id: comment3.id, trashed: true })
    .shouldFailWithError('FORBIDDEN')
})

test('unauthenticated user gets error', async () => {
  await mutation
    .forUnauthenticatedUser()
    .withInput({ id: comment.id, trashed: true })
    .shouldFailWithError('UNAUTHENTICATED')
})
