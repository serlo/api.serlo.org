import gql from 'graphql-tag'

import { article, comment1, user } from '../../../__fixtures__'
import { nextUuid, givenThreads, Client, given } from '../../__utils__'
import { DiscriminatorType } from '~/model/decoder'
import { encodeThreadId } from '~/schema/thread/utils'

const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation ($input: ThreadCreateCommentInput!) {
        thread {
          createComment(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput({
    content: 'Hello',
    threadId: encodeThreadId(comment1.id),
    subscribe: true,
    sendEmail: false,
  })

beforeEach(() => {
  givenThreads({ uuid: article, threads: [[comment1]] })
})

// TODO: Reenable it after we have migrated the entpoint
// We cannot test it since with the current code comments are always resolved from the DB
// Currently we have no code to change the DB
test.skip('comment gets created, cache mutated as expected', async () => {
  given('UuidQuery').for(user)
  given('ThreadCreateCommentMutation')
    .withPayload({
      userId: user.id,
      content: 'Hello',
      threadId: comment1.id,
      subscribe: true,
      sendEmail: false,
    })
    .returns({
      __typename: DiscriminatorType.Comment,
      id: nextUuid(comment1.id),
      trashed: false,
      alias: `/mathe/${nextUuid(comment1.id)}/`,
      authorId: user.id,
      title: null,
      date: '2014-03-01T20:45:56Z',
      archived: false,
      content: 'Hello',
      parentId: comment1.id,
      childrenIds: [],
      status: 'open',
    })

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
        nodes: [{ comments: { nodes: [{ content: comment1.content }] } }],
      },
    },
  })

  await mutation.shouldReturnData({
    thread: { createComment: { success: true } },
  })

  await queryComments.shouldReturnData({
    uuid: {
      threads: {
        nodes: [
          {
            comments: {
              nodes: [{ content: comment1.content }, { content: 'Hello' }],
            },
          },
        ],
      },
    },
  })
})

test('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})
