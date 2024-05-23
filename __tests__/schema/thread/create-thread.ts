import gql from 'graphql-tag'

import { article, comment, comment1, user } from '../../../__fixtures__'
import { Client, given } from '../../__utils__'
import { DiscriminatorType } from '~/model/decoder'

const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation createThread($input: ThreadCreateThreadInput!) {
        thread {
          createThread(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput({
    title: 'My new thread',
    content: '🔥 brand new!',
    objectId: article.id,
    subscribe: true,
    sendEmail: false,
  })

// TODO: Enable once the mutation is migrated into the API
test.skip('thread gets created, cache mutated as expected', async () => {
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
                      title
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
        nodes: [
          {
            comments: {
              nodes: [{ title: comment.title, content: comment.content }],
            },
          },
        ],
      },
    },
  })

  given('ThreadCreateThreadMutation')
    .withPayload({
      title: 'My new thread',
      content: '🔥 brand new!',
      objectId: article.id,
      subscribe: true,
      sendEmail: false,
      userId: user.id,
    })
    .returns({
      __typename: DiscriminatorType.Comment,
      id: comment1.id,
      trashed: false,
      alias: `/mathe/${comment1.id}/`,
      authorId: user.id,
      title: 'My new thread',
      date: '2014-08-25T12:51:02+02:00',
      archived: false,
      content: '🔥 brand new!',
      parentId: article.id,
      childrenIds: [],
      status: 'open',
    })

  await mutation.shouldReturnData({
    thread: { createThread: { success: true } },
  })

  await queryComments.shouldReturnData({
    uuid: {
      threads: {
        nodes: [
          {
            comments: {
              nodes: [{ title: 'My new thread', content: '🔥 brand new!' }],
            },
          },
          {
            comments: {
              nodes: [{ title: comment.title, content: comment.content }],
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
