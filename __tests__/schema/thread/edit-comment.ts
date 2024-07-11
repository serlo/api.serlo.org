import gql from 'graphql-tag'

import { comment as baseComment, user } from '../../../__fixtures__'
import { Client, commentQuery } from '../../__utils__'

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

test('changes content of a comment', async () => {
  await commentQuery.withVariables({ id: comment.id }).shouldReturnData({
    uuid: {
      content:
        'Könnte man nicht auch "Addiere folgende ein- beziehungsweise zweistelligen Zahlen im Kopf"?',
    },
  })

  await mutation.shouldReturnData({
    thread: { editComment: { success: true } },
  })

  await commentQuery
    .withVariables({ id: comment.id })
    .shouldReturnData({ uuid: { content: newContent } })
})

test('fails when new comment is empty', async () => {
  await mutation
    .changeInput({ content: '' })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})
