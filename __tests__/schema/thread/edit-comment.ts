/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'

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
