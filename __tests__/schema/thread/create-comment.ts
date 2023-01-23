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

import { article, comment1, user } from '../../../__fixtures__'
import {
  nextUuid,
  givenThreads,
  Client,
  given,
  castToAlias,
} from '../../__utils__'
import { DiscriminatorType } from '~/model/decoder'
import { encodeThreadId } from '~/schema/thread/utils'

const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation ($input: ThreadCreateCommentInput!) {
        thread {
          createComment(input: $input) {
            success
            record {
              archived
              content
              id
            }
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

test('comment gets created, cache mutated as expected', async () => {
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
      alias: castToAlias(`/mathe/${nextUuid(comment1.id)}/`),
      authorId: user.id,
      title: null,
      date: '2014-03-01T20:45:56Z',
      archived: false,
      content: 'Hello',
      parentId: comment1.id,
      childrenIds: [],
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
    thread: {
      createComment: {
        success: true,
        record: {
          archived: false,
          content: 'Hello',
          id: nextUuid(comment1.id),
        },
      },
    },
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
