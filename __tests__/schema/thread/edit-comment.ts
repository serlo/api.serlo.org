import gql from 'graphql-tag'

import { article, comment, user } from '../../../__fixtures__'
import { givenThreads, Client, given } from '../../__utils__'

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
  .withInput({
    content: newContent,
    commentId: comment.id,
  })

beforeEach(() => {
  given('UuidQuery').for(user)
  givenThreads({ uuid: article, threads: [[comment]] })
})

test('comment is edited, cache mutated as expected', async () => {
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
    thread: {
      editComment: {
        success: true,
      },
    },
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

test('fails when database layer returns a 400er response', async () => {
  given('ThreadEditCommentMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('ThreadEditCommentMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})

test('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})
