import gql from 'graphql-tag'

import { article, comment as baseComment, user } from '../../../__fixtures__'
import { Client, given } from '../../__utils__'

const comment = { ...baseComment, id: 17296 }
const newContent = 'This is new content.'

const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation ($input: ThreadEditCommentInput!) {
        thread {
          editComment(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput({ content: newContent, commentId: comment.id })

const queryComment = new Client()
  .prepareQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          ... on Comment {
            content
          }
        }
      }
    `,
  })
  .withVariables({ id: comment.id })

beforeEach(() => {
  given('UuidQuery').for(user, comment, article)
})

test('changes content of a comment (when comment is not cached)', async () => {
  await mutation.shouldReturnData({
    thread: { editComment: { success: true } },
  })

  await queryComment.shouldReturnData({ uuid: { content: newContent } })
})

test('changes content of a comment (when comment is cached)', async () => {
  await queryComment.execute()

  await mutation.shouldReturnData({
    thread: { editComment: { success: true } },
  })

  await queryComment.shouldReturnData({ uuid: { content: newContent } })
})

test('fails when new comment is empty', async () => {
  await mutation
    .changeInput({ content: '' })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})
