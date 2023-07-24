import gql from 'graphql-tag'

import {
  article,
  article2,
  comment,
  comment1,
  comment2,
  comment3,
  user,
  user2,
} from '../../../__fixtures__'
import { Client, given } from '../../__utils__'

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
})

beforeEach(() => {
  given('UuidQuery').for(
    article,
    article2,
    comment,
    comment1,
    comment2,
    comment3,
    user,
    user2,
  )
})

// TODO: this is actually wrong since the provided comment is a thread
test('trashing any comment as a moderator returns success', async () => {
  given('UuidSetStateMutation')
    .withPayload({ ids: [comment2.id], userId: user.id, trashed: true })
    .returns(undefined)

  await mutation
    .withInput({ id: comment2.id, trashed: true })
    .shouldReturnData({
      thread: { setCommentState: { success: true } },
    })
})

test('trashing own comment returns success', async () => {
  given('UuidSetStateMutation')
    .withPayload({ ids: [comment2.id], userId: user2.id, trashed: true })
    .returns(undefined)

  await mutation
    .withContext({ userId: user2.id })
    .withInput({ id: comment2.id, trashed: true })
    .shouldReturnData({
      thread: { setCommentState: { success: true } },
    })
})

test('trashing the comment from another user returns an error', async () => {
  given('UuidSetStateMutation')
    .withPayload({ ids: [comment3.id], userId: user2.id, trashed: true })
    .returns(undefined)

  await mutation
    .withContext({ userId: user2.id })
    .withInput({ id: comment3.id, trashed: true })
    .shouldFailWithError('FORBIDDEN')
})

test('unauthenticated user gets error', async () => {
  await mutation
    .withInput({ id: comment.id, trashed: true })
    .forUnauthenticatedUser()
    .shouldFailWithError('UNAUTHENTICATED')
})
