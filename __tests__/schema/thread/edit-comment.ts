import gql from 'graphql-tag'
import { type OkPacket } from 'mysql2'

import { article, comment as baseComment, user } from '../../../__fixtures__'
import { Client, castToUuid, given } from '../../__utils__'

const comment = { ...baseComment, id: castToUuid(17296) }
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

beforeEach(() => {
  given('UuidQuery').for(user, comment, article)
})

test('changes content of a comment', async () => {
  await mutation.shouldReturnData({
    thread: { editComment: { success: true } },
  })

  const [result] = await global.transaction!.execute<
    ({ content: string } & OkPacket)[]
  >(`select content from comment where id = ?`, [comment.id])

  expect(result[0].content).toBe(newContent)
})

test.skip('comment is edited, cache mutated as expected', async () => {
  given('ThreadEditCommentMutation')
    .withPayload({
      userId: user.id,
      content: newContent,
      commentId: comment.id,
    })
    .returns(undefined)

  const queryComments = new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int) {
          uuid(id: $id) {
            ... on ThreadAware {
              threads {
                nodes {
                  comments {
                    nodes {
                      content
                    }
                  }
                }
              }
            }
          }
        }
      `,
    })
    .withVariables({ id: article.id })

  await queryComments.shouldReturnData({
    uuid: {
      threads: {
        nodes: [{ comments: { nodes: [{ content: comment.content }] } }],
      },
    },
  })

  await mutation.shouldReturnData({
    thread: { editComment: { success: true } },
  })

  await queryComments.shouldReturnData({
    uuid: {
      threads: {
        nodes: [
          {
            comments: {
              nodes: [
                {
                  content: newContent,
                },
              ],
            },
          },
        ],
      },
    },
  })
})

test('fails when new comment is empty', async () => {
  await mutation
    .changeInput({ content: '' })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})
